export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
};

export const ROUTES = {
    TIME: '/current-time-vietnam',
};

export const HEADERS = {
    CONTENT_TYPE: 'Content-Type',
    APP_JSON_UTF8: 'application/json; charset=utf-8',
};

export const MESSAGES = {
    INVALID_INPUT: "Invalid input data.",
    ENDPOINT_NOT_FOUND: "Endpoint not found.",
};

export const VIETNAM_TIME_OPTIONS = {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
};