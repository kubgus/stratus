import { Router } from 'express';

import { is_user_authenticated } from '../supabase.js';

const router = Router();

import api_router from "./api/index.js";
import { announce_request } from '../util/log.js';
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
