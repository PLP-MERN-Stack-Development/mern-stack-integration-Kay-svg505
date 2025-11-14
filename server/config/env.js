// server/config/env.js
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export default {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || "development",
};
