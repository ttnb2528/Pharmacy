import express from 'express';
import { createStaff } from '../controller/Staff.controller.js';

const router = express.Router();

router.post("/create", createStaff);

export default router;