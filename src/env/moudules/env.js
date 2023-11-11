let API_URL;
let WS_URL;

let API_PREFIX;

if (process.env.NODE_ENV === "development") {
    API_PREFIX = '/api';
    // API_PREFIX = '/';
    API_URL = "http://localhost:9999/";
    // API_URL = "http://server.houqicg.com";
    WS_URL = "ws://localhost:3002";
}

if (process.env.NODE_ENV === "production") {
    API_PREFIX = '/api';
    API_URL = "http://server.houqicg.com";
    WS_URL = "http://43.156.90.25:8322/";
}

export default {
    API_URL,
    API_PREFIX,
    WS_URL,
};
