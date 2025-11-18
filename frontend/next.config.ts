import {version} from "./package.json";

const withPWA = require("next-pwa")({
    dest: "public",
    swSrc: "service-worker.js",
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
});

export default withPWA({
    reactCompiler: true,
    redirects() {
        return [{source: "/", destination: "/login", statusCode: 301}];
    },
    env: {
        NEXT_PUBLIC_APP_VERSION: version,
    },
    images: {
        unoptimized: true,
    }
});
