const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema(
    {
      category: {
        type:String,
        required: true,
        unique:true,
        index:true
    },


    description:{
        type:String,  
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