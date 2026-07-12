import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    proxyClientMaxBodySize: "50mb",
  },
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  turbopack: {
    resolveAlias: {
      "pdfjs-dist/legacy/build/pdf.worker": "pdfjs-dist/legacy/build/pdf.worker.mjs",
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent pdfjs-dist from being bundled on the client
        config.externals.push((context: any, request: any, callback: any) => {
        if (request?.includes("pdfjs-dist") || request?.includes("pdf-parse")) {
          return callback(null, "commonjs " + request);
        }
        callback();
      });
    } else {
      // Server-side: configure pdf.js worker handling
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.alias["pdfjs-dist/legacy/build/pdf.worker"] =
        "pdfjs-dist/legacy/build/pdf.worker.mjs";

      config.module.rules.push({
        test: /\.worker\.mjs$/,
        type: "webassembly/async",
      });
    }

    return config;
  },
};

export default nextConfig;
