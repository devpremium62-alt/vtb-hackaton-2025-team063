import {version} from "./package.json";

const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
});

export default withPWA({
    reactCompiler: true,
    redirects() {
        return [{source: "/", destination: "/dashboard", statusCode: 302}];
    },
    env: {
        NEXT_PUBLIC_APP_VERSION: version,
    },
});
