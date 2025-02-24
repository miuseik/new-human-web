let API_URL;
let WS_URL;
let env = process.env.NODE_ENV
let API_PREFIX;
if (env === "development") {
    API_PREFIX = '/api';
    // API_PREFIX = '/';
    // API_URL = "http://localhost:9100";
    API_URL = "http://new_human_server.qupuba.com";
    WS_URL = "ws://localhost:3002";
}

if (env === "production") {
    API_PREFIX = '/api';
    API_URL = "http://new_human_server.qupuba.com";
    // API_URL = "http://121.40.151.10:9000";
    WS_URL = "http://43.156.90.25:8322/";
}

export default {
    API_URL,
    API_PREFIX,
    WS_URL,
};
