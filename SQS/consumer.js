// consumer.js
require("dotenv").config();
const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  ChangeMessageVisibilityCommand,
} = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({ region: "eu-north-1" });

// Replace with your actual queue URL
const QUEUE_URL = "https://sqs.eu-north-1.amazonaws.com/289979559809/Demo";

// --- Choose polling type ---
const POLL_TYPE = "long"; // change to "short" to test short polling

// --- Polling configuration ---
const params = {
  QueueUrl: QUEUE_URL,
  MaxNumberOfMessages: 1, // fetch one message at a time
  VisibilityTimeout: 20, // message hidden for 20s after being received
  WaitTimeSeconds: POLL_TYPE === "long" ? 10 : 0, // 10s for long poll, 0s for short poll
};

async function pollMessages() {
  console.log(`🚀 Consumer started with ${POLL_TYPE} polling...\n`);

  try {
    const command = new ReceiveMessageCommand(params);
    const result = await sqsClient.send(command);

    if (!result.Messages || result.Messages.length === 0) {
      console.log("⏳ No messages available right now...");
      return;
    }

    const message = result.Messages[0];
    const body = JSON.parse(message.Body);

    console.log("📩 Received Message:", body);
    console.log(
      "🔒 Message invisible for",
      params.VisibilityTimeout,
      "seconds"
    );

    // Simulate message processing (takes 15s)
    await new Promise((res) => setTimeout(res, 15000));

    console.log(`✅ Processed order: ${body.orderId}`);

    // Optionally extend visibility timeout dynamically (if long processing)
    // await sqsClient.send(new ChangeMessageVisibilityCommand({
    //   QueueUrl: QUEUE_URL,
    //   ReceiptHandle: message.ReceiptHandle,
    //   VisibilityTimeout: 60, // extend by 60 seconds
    // }));

    // Delete message after successful processing
    await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
      })
    );

    console.log("🗑️ Message deleted from queue\n");
  } catch (err) {
    console.error("❌ Error receiving or processing message:", err);
  }
}

// Poll messages repeatedly every few seconds
setInterval(pollMessages, 5000);
