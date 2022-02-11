const grid = require('@sendgrid/mail')

grid.setApiKey(process.env.GRID_API_KEY)

const sendWelcomeEmail = (email , name) => {
    grid.send({
        to : email,
        from : 'amir.dv8212@gmail.com',
        subject : 'Welcom to Task-Manager app!',
        text : `Hi ${name} , thank you for sign up and i hope you have a perfect experience here!`
    })
}

const sendGoodbyeEmail = (email , name) => {
    grid.send({
        to : email,
        from : 'amir.dv8212@gmail.com',
        subject : 'Sorry to see you go!',
        text : `Goodbye ${name} , I hope to see you back sometime soon!`
    })
    
}
module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail 
} 