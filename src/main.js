import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mustache from "mustache-express"
import cookieParser from "cookie-parser";

import { announce_request } from "./util/log.js";

const port = process.env.PORT || 3000;
const dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server);

// setup
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(dirname, "/views"));
// sick workaround so I don't have to configure "mustache" in my LSP
// what a joke
app.set("view engine", "html");
app.engine("html", mustache());

// error handling
app.use(function (err, req, res, next) {
    if (process.env.LOG_ERRORS != 0) console.error(err);
    const error_message = err.message ?? "Unknown error";
    res.status(err.status || 500).send(error_message);
    announce_request(req, error_message);
});

// routes
import router from "./routes/index.js";
import { supabase } from "./supabase.js";
import * as forwarding from "./forwarding.js";
app.use(router);
app.use("/static", express.static(path.join(dirname, "/static")));

// sockets for the CLI
io.on("connection", (socket) => {
    console.log("[SOCKET] Connection established");

    socket.on("token_verify", (data, callback) => {
        console.log("[SOCKET] Verifying token");
        supabase.from("subdomains").select().eq("token", data.token).single().then((data) => {
            if (data.error) {
                console.log("[SOCKET] Token verification failed");
                callback({
                    error: data.error.message
                });
            } else {
                console.log("[SOCKET] Token verified");
                callback({
                    data: data.data
                });

                forwarding.forward_socket(data.data.id, socket);
                console.log(`[SOCKET] Started forwarding to ${data.data.id}`);
            }
        });
    });

    socket.on("disconnect", () => {
        console.log("[SOCKET] Disconnected");
    });
});

// server
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
