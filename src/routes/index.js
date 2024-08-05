import { Router } from 'express';

import * as auth from '../util/auth.js';

const router = Router();

import api_router from "./api/index.js";
router.use("/api", api_router);

router.get("/", (req, res) => {
    if (auth.is_valid_token(req.cookies.stratus_token)) {
        res.render("index");
        return;
    }
    res.redirect("login");
});

router.get("/health", (req, res) => {
    res.send("OK");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

export default router;
