const Product = require("../../models/product.models.js");

const productSearch = async (req, res) => {
  const query = req.query.q?.trim();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!query) return res.json({ products: [], total: 0 });

  try {
    const pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "productCategory",
          foreignField: "_id",
          as: "categoryData"
        }
      },
      { $unwind: "$categoryData" },
      {
        $lookup: {
          from: "subcategories",
          localField: "productSubCategory",
          foreignField: "_id",
          as: "subCategoryData"
        }
      },
      { $unwind: "$subCategoryData" },
      {
        $match: {
          $or: [
            { productName: { $regex: query, $options: "i" } },
            { "categoryData.name": { $regex: query, $options: "i" } },
            { "subCategoryData.name": { $regex: query, $options: "i" } }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          categoryName: "$categoryData.name",
          subCategoryName: "$subCategoryData.name",
          productImage: 1,
          productMrp: 1,
          productDiscount: 1,
          discountedPrice: 1
        }
      }
    ];

    // Count total matching results
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Product.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination stages
    pipeline.push({ $skip: skip }, { $limit: limit });

    const products = await Product.aggregate(pipeline);

    res.json({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Error fetching Search" });
  }
};

module.exports = productSearch;
