import path from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadDotenv } from "dotenv";
import withRspack from "next-rspack";
import type { NextConfig } from "next";

const appDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(appDir, "../..");

// Local/dev: load monorepo root .env so BACKEND_URL is available at runtime.
loadDotenv({ path: path.join(monorepoRoot, ".env"), quiet: true });

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/types"],
};

export default withRspack(nextConfig);
