// routers/index.mjs - ĐÃ SỬA LẠI ✨
import sumRouter from './sum/index.mjs';

const mainRoutes = [
    { basePath: '/sum', router: sumRouter },
];

function mainRouter(request, response) {
    // request.url lúc này đã là một chuỗi đúng như mong đợi.
    const originalUrl = request.url;
    const { pathname } = new URL(originalUrl, `http://${request.headers.host}`);

    const mainRoute = mainRoutes.find(route => pathname.startsWith(route.basePath));

    if (mainRoute) {
        // Cắt chuỗi để router con xử lý phần còn lại.
        request.url = originalUrl.substring(mainRoute.basePath.length) || '/';
        mainRoute.router(request, response);
    } else {
        response.writeHead(404);
        response.end(JSON.stringify({ error: "Endpoint not found." }));
    }
}

export default mainRouter;