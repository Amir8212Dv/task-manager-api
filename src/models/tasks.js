const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL_DEV , {useNewUrlParser : true})

const schema = new mongoose.Schema({
    task : {
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        required : false,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
} , {
    timestamps : true
})

const Task = mongoose.model('Task' , schema)


module.exports = { Task }