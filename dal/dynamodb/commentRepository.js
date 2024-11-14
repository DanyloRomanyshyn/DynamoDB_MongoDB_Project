// dal/dynamodb/commentRepository.js
const AWS = require('aws-sdk');
AWS.config.update(require('../../config/aws-config'));

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Comments';

async function updateComment(postId, commentId, newContent) {
  const params = {
    TableName: 'Comments',  // Назва таблиці
    Key: {
      postId: postId,       // Partition key
      commentId: commentId  // Sort key
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
    console.log('Comment updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}

async function getCommentsForPost(postId) {
  const params = {
    TableName: 'Comments',
    KeyConditionExpression: 'postId = :postId',
    ExpressionAttributeValues: {
      ':postId': postId
    },
    ScanIndexForward: true  // Сортує результати за зростанням (від найстарішого до найновішого)
  };

  try {
    const result = await dynamodb.query(params).promise();
    console.log('Comments retrieved successfully:', result.Items);
    return result.Items;
  } catch (error) {
    console.error('Error retrieving comments:', error);
    throw error;
  }
}



module.exports = { updateComment, getCommentsForPost }; 


