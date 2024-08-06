const socket_map = new Map();

export function forward_socket(subdomain, socket) {
    socket_map.set(subdomain, socket);
    socket.on("disconnect", () => {
        socket_map.delete(subdomain);
        console.log(`[SOCKET] Stopped forwarding to ${subdomain}`);
    });
}

export function get_socket(subdomain) {
    if (!socket_map.has(subdomain)) {
        console.log("[SOCKET] Socket not found");
        return null;
    }
    console.log(`[SOCKET] Found socket for ${subdomain}`);
    return socket_map.get(subdomain);
}
