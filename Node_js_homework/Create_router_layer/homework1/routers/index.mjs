import sumRouter from "./sum/index.mjs";

const mainRoutes = {
    '/sum': sumRouter,
}

function mainRouter(request, response){
    const { pathname } = request.url;

    const baseRoute = Object.keys(mainRoutes).find(route => pathname.startsWith(route));

    if (baseRoute){
        const router = mainRoutes[baseRoute];
        const remainingPath = pathname.substring(baseRoute.length) || '/';
        request.url.pathname = remainingPath;
        router(request, response);
    } else {
        response.writeHead(404);
        response.end(JSON.stringify({
            error: "Endpoint not found."
        }));
    }
}

export default mainRouter;