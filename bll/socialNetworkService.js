// bll/socialNetworkService.js
const { updatePost } = require('../dal/dynamodb/postRepository');
const { updateComment, getCommentsForPost } = require('../dal/dynamodb/commentRepository'); // Додали getCommentsForPost


const { MongoClient } = require('mongodb');
const { savePostToDynamoDB } = require('../dal/dynamodb/postRepository');

async function fetchPostsFromMongoDB() {
  const client = new MongoClient('mongodb://localhost:27017'); // Вкажіть ваш MongoDB URI
  try {
    await client.connect();
    const database = client.db('yourDatabaseName');
    const postsCollection = database.collection('posts');
    
    const posts = await postsCollection.find().toArray();
    console.log('Posts retrieved from MongoDB:', posts);
    return posts;
  } finally {
    await client.close();
  }
}

async function importPostsToDynamoDB() {
  const posts = await fetchPostsFromMongoDB();
  for (const post of posts) {
    await savePostToDynamoDB(post);
  }
  console.log('All posts imported to DynamoDB');
}


async function editPost(postId, newContent) {
  try {
    const result = await updatePost(postId, newContent);
    return result;
  } catch (error) {
    console.error('Failed to edit post:', error);
    throw error;
  }
}

async function editComment(postId, commentId, newContent) {
  try {
    const result = await updateComment(postId, commentId, newContent);
    return result;
  } catch (error) {
    console.error('Failed to edit comment:', error);
    throw error;
  }
}

module.exports = { editPost, editComment, getCommentsForPost, importPostsToDynamoDB };
