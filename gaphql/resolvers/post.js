const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const checkAuth = require("../utils/check-auth");
const validator = require("validator");
module.exports = {
  Query: {
    async posts() {
      try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        return posts;
      } catch (e) {
        console.log(e);
        throw new Error(e);
      }
    },
    async post(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found!");
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      try {
        if (validator.isEmpty(body)) {
          throw new Error("Post body cannot be empty!");
        }
        const user = checkAuth(context);
        if (user) {
          const post = new Post({
            body,
            user: user.id,
            username: user.username,
            createdAt: new Date().toISOString()
          });
          return await post.save();
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (post.username == user.username) {
          await post.delete();
          return "Post deleted";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (post) {
          const liked = post.likes.find(like => like.username === username);
          if (liked) {
            // post is liked, unlike it
            post.likes = post.likes.filter(like => like.username !== username);
          } else {
            //like post
            post.likes.push({
              username,
              createdAt: new Date().toDateString()
            });
          }
          await post.save();
          return post;
        } else throw new UserInputError("Post not found!");
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};
