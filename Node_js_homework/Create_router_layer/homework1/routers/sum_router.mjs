import handleSumRequest from '../controllers/sum_controller.mjs';
import { URL } from 'url';
function handleSumRouteNotFound(request, response) {
    response.writeHead(404);
    response.end(JSON.stringify({ error: "Endpoint invalid." }));
}

const sumRoutes = {
    'GET /sum': handleSumRequest,
    'default': handleSumRouteNotFound
};

function sumRouter(request, response) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const { pathname, searchParams } = url;

    const routeKey = `${request.method} ${pathname}`;
    const handler = sumRoutes[routeKey] || sumRoutes['default'];

    console.log(`Router sum is processing: '${routeKey}'`);
    handler(request, response, searchParams);
}

export default sumRouter;