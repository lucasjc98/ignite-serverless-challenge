import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";
import { v4 as uuid } from "uuid";

interface ICreateTodo {
  title: string
  deadline: Date,
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  const id = uuid();

  const todoParams = {
    TableName: "todos",
    Item: {
      id,
      user_id,
      title,
      done: false,
      deadline: new Date(deadline),
    }
  }

  await document.put(todoParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(todoParams.Item),
    headers: {
      "Content-type": "application/json",
    }
  }
}