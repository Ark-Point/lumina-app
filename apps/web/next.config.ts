import dotenv from "dotenv";
import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../..");
const envFiles = [
  "env",
  process.env.NODE_ENV === "production" ? "env.production" : "env.local",
  "env.local",
].map((f) => path.join(root, f));

for (const file of envFiles) {
  if (fs.existsSync(file)) dotenv.config({ path: file });
}

const nextConfig: NextConfig = {
  env: {
    // NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  },
  /* config options here */
  typescript: {},
};

export default nextConfig;
