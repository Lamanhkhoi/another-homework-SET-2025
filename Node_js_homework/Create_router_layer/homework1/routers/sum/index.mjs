import handleSumRequest from '../../controllers/sum/index.mjs';

function handleSumRouteNotFound(request, response) {
    response.writeHead(404);
    response.end(JSON.stringify({ error: "Endpoint for 'sum' is invalid."}));
}

const sumRoutes = [
    { method: 'GET', path: '/', handler: handleSumRequest }, 
];

function sumRouter(request, response) {
    const { pathname, searchParams } = new URL(request.url, `http://${request.headers.host}`);

    const route = sumRoutes.find(r => r.method === request.method && r.path === pathname);

    if (route) {
        console.log(`Router 'sum' found handler for: ${route.method} ${route.path}`);
        route.handler(request, response, searchParams);
    } else {
        handleSumRouteNotFound(request, response);
    }
}

export default sumRouter;