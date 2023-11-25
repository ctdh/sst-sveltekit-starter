/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0

ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html.

Purpose:
ses_sendemail.js demonstrates how to send an email using Amazon SES.

Running the code:
node ses_sendemail.js

*/
// snippet-start:[ses.JavaScript.email.sendEmailV3]
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient";

const formatBody = (data: string) => ({
  Charset: "UTF-8",
  Data: data,
});

const sendEmail = async (recipient: string, sender: string, subject: string, textBody: string, htmlBody: string) => {
  const params = {
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: formatBody(textBody),
        Html: formatBody(htmlBody),
      },
      Subject: formatBody(subject),
    },
    Source: sender,
  };
   
  const sendEmailCommand = new SendEmailCommand(params);

   try {
     const data = await sesClient.send(sendEmailCommand);
     console.log("Email sent successfully", data);
     return data;
   } catch (error) {
     console.error("Failed to send email.", error);
     return error;
   }
};

export { sendEmail };