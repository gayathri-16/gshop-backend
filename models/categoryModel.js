const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema(
    {
      category: {
        type:String,
        required: true,
        unique:true,
        index:true
    },
    isActive:{
        type:Boolean,
        required:true
    },

    description:{
        type:String,  
    },
    
    isActive:{
        type:Boolean,
        require:true
    },
    
    images: [
        {
            image: {
                type: String,
        
                }
        }
    ],

    createdAt:{
        type:Date,
        default:Date.now()
    }
        
},

{timestamps:true}
)
let Category = mongoose.model('Category',categorySchema)

module.exports = Category;