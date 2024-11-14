const { MongoClient } = require('mongodb');
const { importPostsToDynamoDB } = require('./bll/socialNetworkService'); // Імпортуйте вашу функцію для імпорту до DynamoDB

// Функція для отримання постів з MongoDB
async function fetchPostsFromMongoDB() {
  const client = new MongoClient('mongodb://localhost:27017'); // Замініть на ваш MongoDB URI
  try {
    await client.connect();
    const database = client.db('social_network'); // Замініть на ім'я вашої бази даних
    const collection = database.collection('posts'); // Замініть на ім'я колекції
    const posts = await collection.find({}).toArray();
    console.log('Posts retrieved from MongoDB:', posts);
    return posts;
  } catch (error) {
    console.error('Error retrieving posts from MongoDB:', error);
  } finally {
    await client.close();
  }
}

// Головна функція для імпорту постів з MongoDB до DynamoDB
(async function main() {
  try {
    const posts = await fetchPostsFromMongoDB();
    if (posts && posts.length > 0) {
      await importPostsToDynamoDB(posts);
      console.log('Posts imported successfully');
    } else {
      console.log('No posts found in MongoDB to import.');
    }
  } catch (error) {
    console.error('Error during import process:', error);
  }
})();
