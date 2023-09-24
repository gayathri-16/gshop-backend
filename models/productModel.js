const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
     name:{
        type:String,
        required:[true,"Please enter product name"],
        trim: true,
        maxLength:[100,"Product name cannot be above 100 characters"],

    },
    price:{
        type:Number,
        default:0.0
    },
    description:{
       type:String
    },
    ratings:{
        type:String,
        default:0
    },
    
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
 
    category: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category",
         required : [true, 'Product must belong to a category'],
    
    },
    isActive:{
        type:Boolean,
        required:true
    },
    mrpPrice:{
        type:Number,
        default:0.0
    },
   productcode:{
    type:String,
    unique:true
   },

    deliveryCharge:{
        type:String,
        required:[true,"Please Enter  Delivery Charge"]
    },
    video:{
        type:String,
    
    },
 



    stock:{
        type:Number,
        // required:[true,"Please enter product stock"],
        // maxLenth:[20,'Product stock cannot exceed 20']
    },
    role:String,

    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
         user: mongoose.Schema.Types.ObjectId,
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
       type: mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
        
},
{timestamps: true}
);
productSchema.index({name:'text'})
let schema = mongoose.model('Product',productSchema)

module.exports = schema;