export function announce_request(req, status) {
    try {
        const ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const method = req.method;
        const url = req.url;
        console.log(`[REQUEST] ${ip}#${method} -> ${url} :: ${status}`);
    } catch (err) {
        console.error(err);
    }
};
