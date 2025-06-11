import handleSumRequest from './controller/sum_controller.mjs';

function handleNotFound(request, response){
    response.writeHead(404);
    response.end(JSON.stringify({
        error : `Endpoint ${request.method} ${request.url} not found.`
    }));
}

const routes = {
    'GET /sum': handleSumRequest,
    'default': handleNotFound
};

function router(request, response) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const { pathname, searchParams } = url; 

    const routeKey = `${request.method} ${pathname}`;
    const handler = routes[routeKey] || routes['default'];

    console.log(`Router đang điều phối route: '${routeKey}'`);

    handler(request, response, searchParams);
}

export default router;