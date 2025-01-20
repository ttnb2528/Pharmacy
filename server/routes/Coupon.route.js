import express from 'express';
import { createCoupon, deleteCoupon, getCoupon, getCoupons, updateCoupon } from '../controller/Coupon.controller.js';

const router = express.Router();

router.post('/createCoupon', createCoupon);
router.get('/getCoupons', getCoupons);
router.get('/getCoupon/:id', getCoupon);
router.put('/updateCoupon/:id', updateCoupon);
router.delete('/deleteCoupon/:id', deleteCoupon);

export default router;