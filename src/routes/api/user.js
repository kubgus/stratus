import { Router } from 'express';

import { announce_request } from '../../util/log.js';
import { supabase } from '../../supabase.js';

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = await req.body;

    if (!email || !password) {
        announce_request(req, "400: Missing email or password");
        res.status(400).send("Missing email or password");
        return;
    }

    const { error } = await supabase.auth
        .signInWithPassword({ email, password });

    if (error) {
        announce_request(req, `500: ${error.message}`);
        res.status(500).send(error.message);
        return;
    }

    announce_request(req, "200: Logged in");
    res.redirect("/");
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

    announce_request(req, "200: Registered");
    res.redirect("/");
});

router.post("/logout", async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        announce_request(req, `500: ${error.message}`);
        res.status(500).send(error.message);
        return;
    }

    announce_request(req, "200: Logged out");
    res.redirect("/login");
});

export default router;
