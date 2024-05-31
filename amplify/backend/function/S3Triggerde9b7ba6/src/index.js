// const AWS = require("aws-sdk");
// const s3 = new AWS.S3();
// const csv = require("csv-parser");
// const kms = new AWS.KMS();
// const { Client } = require("pg"); // PostgreSQL client for Redshift
// require("dotenv").config();

// const kmsKeyId = process.env.KMS_KEY_ID; // Replace with your KMS key ID
// const redshiftCredentials = {
//   host: process.env.REDSHIFT_HOST,
//   database: process.env.REDSHIFT_DATABASE,
//   user: process.env.REDSHIFT_USER,
//   password: process.env.REDSHIFT_PASSWORD,
//   port: parseInt(process.env.REDSHIFT_PORT || "5439", 10),
// };

// exports.handler = async (event) => {
//   const bucketName = event.Records[0].s3.bucket.name;
//   const objectKey = decodeURIComponent(
//     event.Records[0].s3.object.key.replace(/\+/g, " ")
//   );

//   const params = {
//     Bucket: bucketName,
//     Key: objectKey,
//   };

//   console.log("Params: ", params);

//   try {
//     const data = await s3.getObject(params).promise();
//     const csvData = await parseCSV(data.Body);

//     console.log("csvData: ", csvData);

//     const encryptedData = await Promise.all(
//       csvData.map(async (item) => {
//         const encryptedItem = await encryptData(item);
//         return encryptedItem;
//       })
//     );

//     console.log("encryptedData: ", encryptedData);

//     await storeInRedshift(encryptedData);

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: "File processed and data stored successfully",
//       }),
//     };
//   } catch (error) {
//     console.error("Error processing file:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: "Error processing file",
//         error: error.message,
//       }),
//     };
//   }
// };

// function parseCSV(data) {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     const stream = require("stream");
//     const readable = new stream.Readable();
//     readable._read = () => {};
//     readable.push(data);
//     readable.push(null);

//     readable
//       .pipe(csv())
//       .on("data", (row) => results.push(row))
//       .on("end", () => resolve(results))
//       .on("error", (error) => reject(error));
//   });
// }

// async function encryptData(data) {
//   const encryptedData = {};
//   for (const key in data) {
//     const params = {
//       KeyId: kmsKeyId,
//       Plaintext: data[key],
//     };
//     const result = await kms.encrypt(params).promise();
//     encryptedData[key] = result.CiphertextBlob.toString("base64");
//   }
//   return encryptedData;
// }

// async function storeInRedshift(data) {
//   const client = new Client(redshiftCredentials);
//   await client.connect();

//   try {
//     for (const item of data) {
//       const keys = Object.keys(item).join(",");
//       const values = Object.values(item)
//         .map((value) => `'${value}'`)
//         .join(",");
//       const query = `INSERT INTO data (${keys}) VALUES (${values});`;
//       await client.query(query);
//     }
//   } finally {
//     await client.end();
//   }
// }


const AWS = require("aws-sdk");
const s3 = new AWS.S3();
require("dotenv").config();
AWS.config.update({ region: 'ap-southeast-1' });

exports.handler = async (event) => {
  const sqs = new AWS.SQS();
  const bucketName = event.Records[0].s3.bucket.name;
  const objectKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  console.log("Params: ", params);

  try {
    const headResult = await s3
      .headObject(params)
      .promise();
    const fileSize = headResult.ContentLength;
    const chunkSize = 5 * 1024 * 1024; // 5MB
    const numberOfChunks = Math.ceil(fileSize / chunkSize);

    for (let i = 0; i < numberOfChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize - 1, fileSize - 1);

      const message = {
        bucket: bucketName,
        key: objectKey,
        start,
        end,
      };

      console.log('Message: ', message);

      await sqs
        .sendMessage({
          QueueUrl: process.env.SQS_NAME,
          MessageBody: JSON.stringify(message),
          MessageGroupId: "default", // Required for FIFO queues
          MessageDeduplicationId: `${Date.now()}` // Required for FIFO queues
        })
        .promise();
    }

    console.log('File processed and data stored successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File processed and data stored successfully",
      }),
    };
  } catch (error) {
    console.error("Error processing file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error processing file",
        error: error.message,
      }),
    };
  }
};
