import { Router } from 'express';

import { announce_request } from '../../util/log.js';
import { supabase } from '../../supabase.js';
import * as auth from '../../util/auth.js';

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = await req.body;

    if (!email || !password) {
        announce_request(req, "400: Missing email or password");
        res.status(400).send("Missing email or password");
        return;
    }

    const { data, error } = await supabase.auth
        .signInWithPassword({ email, password });

    if (error) {
        announce_request(req, `500: ${error.message}`);
        res.status(500).send(error.message);
        return;
    }

    auth.add_session_token(data);

    res
        .cookie("stratus_token", data.session.access_token, { httpOnly: true })
        .redirect("/");

    announce_request(req, "200: Logged in");
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        announce_request(req, "400: Missing email or password");
        res.status(400).send("Missing email or password");
        return;
    }

    const { error } = await supabase.auth
        .signUp({ email, password });

    if (error) {
        announce_request(req, `500: ${error.message}`);
        res.status(500).send(error.message);
        return;
    }

    const { data, error2 } = await supabase.auth
        .signInWithPassword({ email, password });

    if (error2) {
        announce_request(req, `500: ${error2.message}`);
        res.status(500).send(error2.message);
        return;
    }

    auth.add_session_token(data);

    res
        .cookie("stratus_token", data.session.access_token, { httpOnly: true })
        .redirect("/");

    announce_request(req, "200: Registered");
});

router.post("/logout", async (req, res) => {
    const { error } = await supabase.auth
        .signOut();

    if (error) {
        announce_request(req, `500: ${error.message}`);
        res.status(500).send(error.message);
        return;
    }

    auth.remove_session_token(req.cookies["stratus_token"]);

    res
        .clearCookie("stratus_token")
        .redirect("/login");

    announce_request(req, "200: Logged out");
});

export default router;
