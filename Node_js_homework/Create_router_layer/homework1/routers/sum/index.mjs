import handleSumRequest from '../../controllers/sum/index.mjs';

function handleSumRouteNotFound(request, response) {
    response.writeHead(404);
    response.end(JSON.stringify({ error: "Endpoint for 'sum' is invalid."  }));
}

const sumRoutes = {
    'GET /': handleSumRequest,
    'default': handleSumRouteNotFound
};

function sumRouter(request, response) {
    const { pathname, searchParams } = request.url;

    const routeKey = `${request.method} ${pathname}`;
    const handler = sumRoutes[routeKey] || sumRoutes['default'];

    console.log(`Router sum is processing: '${routeKey}'`);
    handler(request, response, searchParams);
}

export default sumRouter;