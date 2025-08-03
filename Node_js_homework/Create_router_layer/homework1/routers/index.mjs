import sumRouter from './sum/index.mjs';

const mainRoutes = [
    { basePath: '/sum', router: sumRouter },
];

function mainRouter(request, response) {
    const originalUrl = request.url;
    const { pathname } = new URL(originalUrl, `http://${request.headers.host}`);
    const mainRoute = mainRoutes.find(route => pathname.startsWith(route.basePath));

    if (mainRoute) {
        request.url = originalUrl.substring(mainRoute.basePath.length) || '/';
        mainRoute.router(request, response);
    } else {
        response.writeHead(404);
        response.end(JSON.stringify({ error: "Endpoint not found." }));
    }
}

export default mainRouter;