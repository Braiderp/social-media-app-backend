const gql = require("graphql-tag");
module.exports = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    body: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    createdAt: String!
    username: String!
  }

  type Query {
    posts: [Post]
    post(postId: ID!): Post
  }

  input RegisterInput {
    username: String!
    password: String!
    email: String!
    confirmPassword: String!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;
