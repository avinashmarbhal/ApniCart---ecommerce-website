const mongoose = require('mongoose');

const moreDetails = {
  url : {
      type : String,
      required : true,
  },
  id : {
      type : String,
      required : true,
  }
}

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productQnt: { type: Number, required: true },
    productDescrip: { type: String },
    productImage: moreDetails,
    productMrp: { type: Number, required: true }, 
    productDiscount: { type: Number, default: 0 },
    discountedPrice: { type: Number }, 
    productOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    productSubCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },    
    productRating: { type: Number},    
    productReviewCount: { type: Number },    
  }, { timestamps: true });
  
  productSchema.pre('save', function (next) {
    if (this.isModified('productMrp') || this.isModified('productDiscount') || this.isNew) {
      const discountAmount = (this.productMrp * this.productDiscount) / 100;
      this.discountedPrice = Math.round(this.productMrp - discountAmount);
    }
    next();
  });
  
  module.exports = mongoose.model('Product', productSchema);