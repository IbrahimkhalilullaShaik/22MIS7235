import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const AUTH_API =
  "http://4.224.186.213/evaluation-service/auth";

const LOG_API =
  "http://4.224.186.213/evaluation-service/logs";

async function getAccessToken() {
  const response = await axios.post(AUTH_API, {
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLL_NO,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  return response.data.access_token;
}

export async function Log(
  stack: string,
  level: string,
  pkg: string,
  message: string
) {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("LOG SUCCESS:");
    console.log(response.data);
  } catch (error: any) {
    console.error(
      "LOG ERROR:",
      error?.response?.data || error.message
    );
  }
}