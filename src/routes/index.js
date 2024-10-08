import { Router } from 'express';

import { is_user_authenticated } from '../supabase.js';
import _ from 'lodash';

const router = Router();

// middleware
router.use((req, res, next) => {
    const subdomain = req.subdomains[0];
    if (subdomain) {
        console.log(`[SUBDOMAIN] Attempting forwarding to ${subdomain}`);
        const socket = get_socket(subdomain);
        if (socket) {
            const small_req = {
                method: req.method,
                url: req.url,
                headers: req.headers,
                query: req.query,
                body: req.body,
                params: req.params,
                protocol: req.protocol,
                path: req.path,
            };
            socket.emit("forward_request", { data: small_req }, (r) => {
                for (const key in r.headers) {
                    res.setHeader(key, r.headers[key]);
                }
                res.send(r.data);
            });
            return;
        }
    }
    next();
});

import api_router from "./api/index.js";
import { announce_request } from '../util/log.js';
import { get_socket } from '../forwarding.js';
router.use("/api", api_router);

router.get("/", async (req, res) => {
    if (await is_user_authenticated()) {
        announce_request(req, "200: Index");
        res.render("index");
        return;
    }
    announce_request(req, "Redirecting to login");
    res.redirect("login");
});

router.get("/login", async (req, res) => {
    if (await is_user_authenticated()) {
        announce_request(req, "Redirecting to index");
        res.redirect("/");
        return;
    }
    announce_request(req, "200: Login");
    res.render("login");
});

router.get("/register", async (req, res) => {
    if (await is_user_authenticated()) {
        announce_request(req, "Redirecting to index");
        res.redirect("/");
        return;
    }
    announce_request(req, "200: Register");
    res.render("register");
});

export default router;
