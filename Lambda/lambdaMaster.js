require("dotenv").config();
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const client = new LambdaClient({ region: process.env.AWS_REGION });

const handler = async () => {
  try {
    const payload = {
      CustId: "30071993",
      name: "Testing",
      Message: "Invoking Lambda from another lambdaMaster",
    };
    const result = await client.send(
      new InvokeCommand({
        FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME || "LambdaToInvoke",
        payload,
        InvocationType: "RequestResponse", // or "Event" for async call
      })
    );
    // TODO implement
    const response = {
      statusCode: 200,
      body: JSON.parse(result),
    };
    return response;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

handler();
