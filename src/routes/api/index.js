import { Router } from 'express';

const router = Router();

// API docs
// - users: login, register, logout, remove
// - subdomains: add, remove, edit, search

import user_router from "./user.js";
router.use("/user", user_router);

import subdomain_router from "./subdomain.js";
router.use("/sd", subdomain_router);

export default router;
