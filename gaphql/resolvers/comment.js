const Post = require("../../models/Post");
const checkAuth = require("../utils/check-auth");
const validator = require("validator");
const { UserInputError, AuthenticationError } = require("apollo-server-errors");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (validator.isEmpty(body)) {
        throw new UserInputError("Empty Comment", {
          errors: {
            body: "comment body cannot be empty"
          }
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });
        return await post.save();
      } else {
        throw new UserInputError("Post not found!");
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        const i = post.comments.findIndex(c => c.id === commentId);
        if (post.comments[i].username === username) {
          post.comments.splice(i, 1);
          await post.save();
          return post;
        } else {
          new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    }
  }
};
