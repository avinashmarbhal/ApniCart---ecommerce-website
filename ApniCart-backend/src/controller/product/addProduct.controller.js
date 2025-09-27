const Product = require("../../models/product.models.js");
const fs = require("fs")
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinary.js");

const addProduct = async (req, res) => {
  const {
    productName,
    productQnt,
    productDescrip,
    productMrp,
    productDiscount,
    productCategory,
    productSubCategory,
  } = req.body;

  if (
    !productName ||
    !productQnt ||
    !productDescrip ||
    !productMrp ||
    !productDiscount ||
    !productCategory ||
    !productSubCategory
  ) {
    return res.status(400).json({ err: "All fields are required" });
  }

  const imageLocalPath = req.file?.path;
 

  if (!imageLocalPath) {
    return res.status(400).json({ err: "Image is missing!" });
  }

  let imageFile;
  try {
    
    imageFile = await uploadOnCloudinary(imageLocalPath);
    
    if (!imageFile || !imageFile.url) {
      throw new Error("Cloudinary upload returned invalid result");
    }
  } catch (error) {
    return res.status(500).json({ err: "Failed to upload image: " + error.message });
  }

  try {
    const product = await Product.create({
      productImage: {
        id: imageFile.public_id,
        url: imageFile.url,
      },
      productName,
      productQnt,
      productDescrip,
      productMrp,
      productDiscount,
      productCategory,
      productSubCategory,
      productOwner: req.user?._id,
    });

    res.status(201).json({ createdProduct: product });
  } catch (error) {
    
    
    // Clean up image if DB insertion fails
    if (imageFile?.public_id) {
      await deleteFromCloudinary(imageFile.public_id);
    }

    res.status(500).json({ err: "Failed to upload product: " + error.message });
  }
};

module.exports = addProduct;
