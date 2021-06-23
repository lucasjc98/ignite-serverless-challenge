import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const todoParams = {
    TableName: "todos",
    KeyConditionExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id,
    }
  }

  const response = await document.query(todoParams).promise();

  if (!response) {
    return {
      statusCode: 400,
      body: JSON.stringify ({
        message: "Usuário não encontrado!"
      }),
      headers: {
        "Content-type": "application/json",
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items),
    headers: {
      "Content-type": "application/json",
    }
  }
}