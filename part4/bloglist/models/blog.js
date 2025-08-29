const mongoose = require('mongoose')

const url = require('../utils/config').MONGODB_URI
console.log('connecting to', url)
mongoose.set('strictQuery', false)
mongoose.connect(url).then(
    console.log('Database connected')
).catch(error => console.log('error while connecting to database:', error.message))

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, 'Title is required'],
    },
    author:String,
    url:{
        type:String,
        required: [true, 'URL is required'],
    },
    likes:{
        default:0,
        type: Number
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})


blogSchema.set('toJSON',{
    transform:(document, returnObject)=>{
        returnObject.id = returnObject._id.toString()

        delete returnObject.__v
        delete returnObject._id
    }
})

module.exports = mongoose.model('Blog', blogSchema)
