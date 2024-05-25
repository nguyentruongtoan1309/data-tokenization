/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const { createPresignedUrlWithClient, getData } = require("./utils");

// declare a new express app
const app = express();
app.use(awsServerlessExpressMiddleware.eventContext());

// Middleware to capture the event object and attach it to the req object
app.use((req, res, next) => {
  req.event = req.apiGateway.event;
  next();
});

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/**********************
 * Example get method *
 **********************/

app.get("/raw-data", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

app.get("/data", async function (req, res) {
  try {
    console.log("Get data request event: ", req.event);
    const dataResult = await getData(req?.event);
    res.json({ success: true, data: dataResult });
  } catch (error) {
    console.log("get data ERROR: ", error?.stack || error?.message);
    res.json({ success: false, data: null, message: error.message });
  }
});

app.get("/raw-data/generate-presigned-url", async function (req, res) {
  try {
    const presignedUrl = await createPresignedUrlWithClient();
    res.json({ success: true, data: presignedUrl });
  } catch (error) {
    console.log(
      "generate-presigned-url ERROR: ",
      error?.stack || error?.message
    );
    res.json({ success: false, data: null, message: error.message });
  }
});

app.post("/raw-data", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.delete("/raw-data", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
