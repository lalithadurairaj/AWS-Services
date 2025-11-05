require("dotenv").config();
// producer.js
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

// Initialize SQS client
const sqsClient = new SQSClient({ region: "eu-north-1" });

// Replace with your actual queue URL
const QUEUE_URL = "https://sqs.eu-north-1.amazonaws.com/289979559809/Demo";

async function sendMessage() {
  const params = {
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify({
      orderId: "ORD-" + Date.now(),
      product: "Winter Lotion",
      customer: "Lalitha",
      createdAt: new Date().toISOString(),
    }),
    DelaySeconds: 10, // Delay message visibility by 10 seconds
  };

  try {
    const command = new SendMessageCommand(params);
    const result = await sqsClient.send(command);
    console.log("✅ Message sent successfully!");
    console.log("MessageId:", result.MessageId);
    console.log("DelaySeconds:", params.DelaySeconds);
  } catch (err) {
    console.error("❌ Error sending message:", err);
  }
}

sendMessage();
