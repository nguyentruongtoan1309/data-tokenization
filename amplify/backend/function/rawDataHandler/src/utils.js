const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const moment = require("moment-timezone");
const AWS = require("aws-sdk");
const { Client } = require("pg");
const kms = new AWS.KMS();
require("dotenv").config();

const kmsKeyId = process.env.KMS_KEY_ID; // Replace with your KMS key ID
const redshiftCredentials = {
  host: process.env.REDSHIFT_HOST,
  database: process.env.REDSHIFT_DATABASE,
  user: process.env.REDSHIFT_USER,
  password: process.env.REDSHIFT_PASSWORD,
  port: parseInt(process.env.REDSHIFT_PORT || "5439", 10),
};

async function getData(event) {
  const userRole = event?.requestContext?.authorizer?.claims["cognito:groups"];
  console.log("userRole: ", userRole);
  try {
    const records = await getFromRedshift();
    const isAdmin = userRole?.includes("Admins");
    const result = await Promise.all(
      records.map(
        async (record) =>
          await decryptData(
            record,
            isAdmin ? Object.keys(record) : ["name", "email", "phone"]
          )
      )
    );

    return {
      statusCode: 200,
      body: result,
    };
  } catch (error) {
    console.error("getData ERROR:", error);
    return {
      statusCode: 500,
      body: null,
      message: JSON.stringify({ error: error?.stack || error?.message }),
    };
  }
}

const getFromRedshift = async () => {
  try {
    const client = new Client(redshiftCredentials);
    await client.connect();

    const query = `SELECT * FROM data;`;
    const result = await client.query(query);

    await client.end();

    if (result.rows.length === 0) {
      throw new Error("Record not found");
    }
    console.log("getFromRedshift rows: ", result.rows);
    return result.rows;
  } catch (error) {
    console.error("getFromRedshift ERROR:", error);
    throw new Error(error?.stack || error?.message);
  }
};

const decryptData = async (encryptedData, decryptKeys) => {
  try {
    const decryptedData = {};

    for (const key in encryptedData) {
      decryptedData[key] = encryptedData[key];
      if (decryptKeys?.includes(key)) {
        const params = {
          KeyId: kmsKeyId,
          CiphertextBlob: Buffer.from(encryptedData[key], "base64"),
        };
        const result = await kms.decrypt(params).promise();
        decryptedData[key] = result.Plaintext.toString("utf8");
      }
    }
    console.log("decryptedData: ", decryptedData);
    return decryptedData;
  } catch (error) {
    console.error("decryptData ERROR:", error);
    throw new Error(error?.stack || error?.message);
  }
};

const partialDecryptRecord = (decryptedData, fieldsToDecrypt) => {
  const partialData = {};
  for (const key of fieldsToDecrypt) {
    partialData[key] = decryptedData[key];
  }
  return partialData;
};

const createPresignedUrlWithClient = () => {
  const client = new S3Client({ region: "ap-southeast-1" });
  const command = new PutObjectCommand({
    Bucket: "rawdatabucketcce54-dev",
    Key: `raw_data_${moment().format("YYYY_MM_DD_HH_MM_SS_x")}.csv`,
  });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

module.exports = { createPresignedUrlWithClient, getData };
