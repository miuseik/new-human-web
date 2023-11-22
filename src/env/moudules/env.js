let API_URL;
let WS_URL;
let env = process.env.NODE_ENV
let API_PREFIX;
if (env === "development") {
    console.log('env',env)
    API_PREFIX = '/api';
    // API_PREFIX = '/';
    API_URL = "http://localhost:9000";
    // API_URL = "http://server.houqicg.com";
    WS_URL = "ws://localhost:3002";
}

if (env === "production") {
    console.log('env',env)
    API_PREFIX = '/api';
    API_URL = "http://server.houqicg.com";
    // API_URL = "http://121.40.151.10:9000";
    WS_URL = "http://43.156.90.25:8322/";
}

export default {
    API_URL,
    API_PREFIX,
    WS_URL,
};
