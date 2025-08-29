const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minLength:3
    },
    name:{
        type:String
    },
    passwordHash:{
        type:String,
        required:true,
    },
    blogs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    }]
})

userSchema.set('toJSON',{
    transform:(document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        
        delete returnObject._id
        delete returnObject.__v
        delete returnObject.passwordHash
    }
})

const user = mongoose.model('User', userSchema)

module.exports = user