const Product = require("../../models/product.models.js");

const getSuggestions = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ error: "Missing search term" });
    }

    const suggestions = await Product.aggregate([
      {
        $search: {
          index: "productAutocomplete", // Use your index name here
          autocomplete: {
            query: search,
            path: "productName"
          }
        }
      },
      {
        $limit: 10
      },
      {
        $project: {
          productName: 1,
          _id: 1
        }
      }
    ]);

    return res.status(200).json({ suggestions });
  } catch (error) {
    return res.status(500).json({ error: "Suggestion fetch failed", details: error });
  }
};


module.exports = getSuggestions;
