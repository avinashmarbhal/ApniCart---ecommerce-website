const Product = require("../../models/product.models.js");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinary.js");

const updateProduct = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(401).json({ err: "atleast one field is required!" });
    }
    const {
      productName,
      productQnt,
      productDescrip,
      productMrp,
      productDiscount,
      productId,
    } = req.body;
    const imageLocalPath = req.file?.path;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ mes: "Product not found!" });
    }

    if (!String(product.productOwner).trim() === String(req.user._id).trim()) {
      return res.status(400).json({ err: "Anuthorize Access!!" });
    }

    let imageFile;
    if (imageLocalPath) {
      try {
        imageFile = await uploadOnCloudinary(imageLocalPath);

        if (!imageFile || !imageFile.url) {
          throw new Error("Cloudinary upload returned invalid result");
        }
      } catch (error) {
        return res
          .status(500)
          .json({ err: "Failed to upload image: " + error.message });
      }
    }

    const newProduct = await Product.findByIdAndUpdate(productId, {
      $set: {
        productName: productName || product.productName,
        productQnt: productQnt || product.productQnt,
        productDescrip: productDescrip || product.productDescrip,
        productImage: {
          id: imageFile?.public_id || product.productImage.id,
          url: imageFile?.url || product.productImage.url,
        },
        productMrp: productMrp || product.productMrp,
        productDiscount: productDiscount || product.productDiscount,
      },
    });

    if (!newProduct) {
      if (imageLocalPath) {
        await deleteFromCloudinary(imageFile.public_id);
      }
      return res.status(500).json({ err: "Failed to update product: " });
    }
    if (imageLocalPath) {
      await deleteFromCloudinary(product.productImage.id);
    }

    return res.status(200).json({ msg: "Product Updated successfully!" });
  } catch (error) {
    console.log(error);
    
    return res.status(400).json({ err: "error while updating product"});
  }
};

module.exports = updateProduct;
