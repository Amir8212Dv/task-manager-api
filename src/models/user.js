const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Task } = require('./tasks')

mongoose.connect( process.env.MONGODB_URL_DEV , {useNewUrlParser : true})

const schema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    age : {
        type : Number,
        required : false,
        min : 0,
        default : 0
    },
    email : {
        type : String,
        unique : true,
        required : false,
        trim : true,
        validate(value) {
            if (!validator.default.isEmail(value)) {
                throw new Error('Invalid email !')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minLength : 6,
        validate(value) {
            if (value === 'password') {
                throw new Error('your password can not be "password"')
            }
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
} , {
    timestamps : true
})

// add a virtual section to User
schema.virtual('tasks' , {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

// set a new method for every user document
schema.methods.generateAuthCode = async function () {
    const token = jwt.sign({_id : this._id.toString()} , process.env.JWT_SECRETE)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}
// set a new method for every user document
schema.methods.publicProfile = function (token)  {
    const {name , age , email , _id , createdAt , updatedAt} = this
    const profile = {
        user : {
            name , age , email , _id , createdAt , updatedAt
        },
        token 
    }
    return profile
}

// set a new method to User class.
schema.statics.findByCredential = async (email , password ) => {
    const user = await User.findOne({email})
    const passwordCheck = await bcrypt.compare(password , user.password)
    if (!user || !passwordCheck) throw new Error()
    return user
    
}

// Delete users tasks when user deleted , with mongoose *middleware*
schema.pre('remove' , async function (next) {
    await Task.deleteMany({owner : this._id})
    next()
})

const User = mongoose.model('User' , schema)

module.exports = { User }