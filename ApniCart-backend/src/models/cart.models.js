const mongoose = require("mongoose");
const Product = require("./product.models")


const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:"true",
        unique: true,
    },
    item:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                require:true,
            },
            quantity:{
                type: Number,
                require: true,
                min:1,
                default:1,
            },
            isSelected:{
                type:Boolean,
                default:true
            }
        }
    ],
    totalItems:{
        type:Number,
        default:0,
    },
    totalDiscountedPrice:{
        type:Number,
        default:0,
    },
    totalMrpPrice:{
        type:Number,
        default:0
    }
  
}, { timestamps: true });


cartSchema.pre("save", async function (next) {
    try {
      let totalItems = 0;
      let totalDiscountedPrice = 0;
      let totalMrpPrice = 0;
  
      for (const cartItem of this.item) {
        if (!cartItem.isSelected) continue; 
  
        const product = await Product.findById(cartItem.product);
        if (!product) continue;
  
        const quantity = cartItem.quantity;
        totalItems += quantity;
        totalDiscountedPrice += product.discountedPrice * quantity;
        totalMrpPrice += product.productMrp * quantity;
      }
  
      this.totalItems = totalItems;
      this.totalDiscountedPrice = totalDiscountedPrice;
      this.totalMrpPrice = totalMrpPrice;
  
      next();
    } catch (err) {
      next(err);
    }
  });
  


module.exports = mongoose.model("Cart", cartSchema);
