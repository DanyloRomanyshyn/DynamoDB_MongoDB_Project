// dal/dynamodb/postRepository.js
const AWS = require('aws-sdk');
AWS.config.update(require('../../config/aws-config'));

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Posts';

async function updatePost(postId, newContent) {
  const params = {
    TableName: tableName,
    Key: {
      postId: postId
    },
    UpdateExpression: 'set content = :content, ModifiedDateTime = :modDate',
    ExpressionAttributeValues: {
      ':content': newContent,
      ':modDate': new Date().toISOString()
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const result = await dynamodb.update(params).promise();
    console.log('Post updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

async function savePostToDynamoDB(post) {
  const params = {
    TableName: 'Posts',
    Item: {
      postId: post._id.toString(),
      content: post.content,
      createdDate: post.createdDate,
      ModifiedDateTime: new Date().toISOString(),
      
    }
  };

  try {
    await dynamodb.put(params).promise();
    console.log(`Post ${post._id} saved to DynamoDB`);
  } catch (error) {
    console.error('Error saving post to DynamoDB:', error);
    throw error;
  }
}

module.exports = { savePostToDynamoDB };

module.exports = { updatePost };
