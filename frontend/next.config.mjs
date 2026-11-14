/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@veilbound/sdk"],
  // The monorepo keeps a second lockfile in frontend/; pin tracing to the repo
  // root with an ABSOLUTE path (Next warns and falls back to a guess otherwise).
  outputFileTracingRoot: path.resolve(__dirname, ".."),
};

export default nextConfig;
