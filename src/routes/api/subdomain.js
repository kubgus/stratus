import { Router } from 'express';

import { is_user_authenticated, supabase } from '../../supabase.js';
import { announce_request } from '../../util/log.js';

const router = Router();

router.post("/add", async (req, res) => {
    const { subdomain } = req.body;

    if (!subdomain) {
        announce_request(req, "400: Missing subdomain");
        res.status(400).send("Missing subdomain");
        return;
    }

    if (!is_user_authenticated()) {
        announce_request(req, "401: Unauthorized");
        res.status(401).send("Unauthorized");
        return;
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
        announce_request(req, `500: ${error.message}`);
        res.status(500).send(error.message);
        return;
    }

    supabase.from("subdomains")
        .insert({
            id: subdomain,
            user_id: data.user.id
        }).select().single().then((data) => {
            if (data.error) {
                announce_request(req, `500: ${data.error.message}`);
                res.status(500).send({ data: data.data, error: data.error });
                return;
            }

            announce_request(req, "200: Subdomain added");
            res.send({ data: data.data, error: data.error });
        });
});

router.post("/remove", async (req, res) => {
    const { subdomain } = req.body;

    if (!subdomain) {
        announce_request(req, "400: Missing subdomain");
        res.status(400).send("Missing subdomain");
        return;
    }

    if (!is_user_authenticated()) {
        announce_request(req, "401: Unauthorized");
        res.status(401).send("Unauthorized");
        return;
    }

    supabase.from("subdomains")
        .delete().eq("id", subdomain).select().single().then((data) => {
            if (data.error) {
                announce_request(req, `500: ${data.error.message}`);
                res.status(500).send({ data: data.data, error: data.error });
                return;
            }

            announce_request(req, "200: Subdomain removed");
            res.send({ data: data.data, error: data.error });
        });
});

router.post("/edit", async (req, res) => {
    const { subdomain, new_subdomain } = req.body;

    if (!subdomain) {
        announce_request(req, "400: Missing subdomain");
        res.status(400).send("Missing subdomain");
        return;
    }

    if (!new_subdomain) {
        announce_request(req, "400: Missing new subdomain");
        res.status(400).send("Missing new subdomain");
        return;
    }

    if (!is_user_authenticated()) {
        announce_request(req, "401: Unauthorized");
        res.status(401).send("Unauthorized");
        return;
    }

    supabase.from("subdomains")
        .update({ id: new_subdomain }).eq("id", subdomain).select().single().then((data) => {
            if (data.error) {
                announce_request(req, `500: ${data.error.message}`);
                res.status(500).send({ data: data.data, error: data.error });
                return;
            }

            announce_request(req, "200: Subdomain edited");
            res.send({ data: data.data, error: data.error });
        });
});

router.get("/list", async (req, res) => {
    if (!is_user_authenticated()) {
        announce_request(req, "401: Unauthorized");
        res.status(401).send("Unauthorized");
        return;
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
        announce_request(req, `500: ${error.message}`);
        res.status(500).send(error.message);
        return;
    }

    supabase.from("subdomains")
        .select().eq("user_id", data.user.id).then((data) => {
            if (data.error) {
                announce_request(req, `500: ${data.error.message}`);
                res.status(500).send({ data: data.data, error: data.error });
                return;
            }

            announce_request(req, "200: Subdomains retrieved");
            res.send({ data: data.data, error: data.error });
        });
});

export default router;
