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
  const query = event?.queryStringParameters;
  console.log("userRole: ", userRole);
  try {
    const result = await getFromRedshift(
      query?.page || 1,
      query?.pageSize || 20
    );
    console.log("getFromRedshift result: ", result);
    const isAdmin = userRole?.includes("Admins");
    const records = await Promise.all(
      result?.data?.map(
        async (record) =>
          await decryptData(
            record,
            isAdmin ? Object.keys(record) : ["name", "email", "phone"]
          )
      )
    );

    return {
      statusCode: 200,
      data: records,
      pagination: result?.pagination,
    };
  } catch (error) {
    console.error("getData ERROR:", error);
    return {
      statusCode: 500,
      data: null,
      message: JSON.stringify({ error: error?.stack || error?.message }),
    };
  }
}

const getFromRedshift = async (page = 1, pageSize = 20) => {
  try {
    const client = new Client(redshiftCredentials);
    await client.connect();

    const offset = (page - 1) * pageSize;

    const query = `SELECT * FROM data LIMIT $1 OFFSET $2;`;
    const countQuery = `SELECT COUNT(*) FROM data;`;

    const resultPromise = client.query(query, [pageSize, offset]);
    const countResultPromise = client.query(countQuery);

    const [result, countResult] = await Promise.all([
      resultPromise,
      countResultPromise,
    ]);

    await client.end();

    if (result.rows.length === 0) {
      throw new Error("Record not found");
    }

    const totalRecords = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
      data: result.rows,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize,
      },
    };
  } catch (error) {
    console.error("getFromRedshift ERROR:", error);
    throw new Error(error?.stack || error?.message);
  }
};

const decryptData = async (encryptedData, decryptKeys) => {
  try {
    const decryptedData = {};
    decryptKeys = decryptKeys?.filter((key) => key !== "id");

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
