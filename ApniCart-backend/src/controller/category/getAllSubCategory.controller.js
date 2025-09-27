const SubCategory = require("../../models/subcategory.models.js")

const getAllSubCategory = async(req,res) =>{
    
   try {
     const allSubCategory = await SubCategory.find()
     res.status(200).json({allSubCategory})
   } catch (error) {
        res.status(400).json({err:error.message})
   }
}



module.exports = getAllSubCategory