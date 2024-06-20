import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },

  // belongs only to one author
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // belongs only to one article
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
