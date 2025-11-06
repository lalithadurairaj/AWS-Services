const handler = async (event) => {
  console.log("Received event from Lambda A:", event);
  const { CustId, message } = event;
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify("Message from " + CustId + " : " + message),
  };
  return response;
};
