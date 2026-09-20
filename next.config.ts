import type { NextConfig } from "next";
const config: NextConfig = { trailingSlash: false, serverExternalPackages: ["@reown/appkit", "@reown/appkit-adapter-ethers"], async redirects() { return [{source:"/:path*.html",destination:"/:path*",permanent:true}]; } };
export default config;
