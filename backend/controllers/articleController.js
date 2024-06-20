import Article from "../models/articleSchema.js";
import User from "../models/userSchema.js";
import Comment from "../models/commentsSchema.js";

// Create Article==========================================
export const createArticle = async (req, res) => {
  try {
    var { title, content, author } = req.body; //extracts the data from http request and we can do multiple things
    const _id = author; // Assuming author is the user ID
    author = await User.findById(_id); // Find the author in the User model

    if (!author) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const newArticle = new Article({
      title,
      content,
      author: author._id,
    });

    const savedArticle = await newArticle.save();

    // Add the article ID to the user's articles array
    author.articles.push(savedArticle._id); //  "articles" is the field in User Schema.
    await author.save();

    // Respond with success message
    res.status(200).json({
      message: "Article created successfully",
      articleId: savedArticle._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// // Get Articles with Pagination
// export const getArticles = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;

//     const articles = await Article.find()
//       .populate("author", "username")
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .sort({ createdAt: -1 });

//     const totalArticles = await Article.countDocuments();

//     res.status(200).json({
//       articles,
//       totalPages: Math.ceil(totalArticles / limit),
//       currentPage: parseInt(page),
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get Single Article by ID===================================================
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("author", "username")
      .populate("comments");

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Article==========================================================
export const updateArticle = async (req, res) => {
  try {
    const { title, content, email } = req.body;
    const article = await Article.findById(req.params.id); // find the article by ID

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const author = await User.findOne({ email });
    if (!author || article.author.toString() !== author._id.toString()) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    // Update the article fields if provided
    if (title) article.title = title;
    if (content) article.content = content;
    article.updatedAt = Date.now();

    const updatedArticle = await article.save(); // in db

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Article===========================================================
export const deleteArticle = async (req, res) => {
  try {
    const { email } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const author = await User.findOne({ email }); // author authorization
    if (!author || article.author.toString() !== author._id.toString()) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    // Removes the article's ID from the author's articles array in the User model.
    await User.findByIdAndUpdate(article.author, {
      $pull: { articles: article._id },
    });

    // Delete all comments associated with the article
    await Comment.deleteMany({ article: article._id });

    // removes the article itself from the database
    await article.deleteOne();

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
