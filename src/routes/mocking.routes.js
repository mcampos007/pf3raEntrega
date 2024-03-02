import { Router } from 'express';
import { getProducts } from '../controllers/products.controller.js';
import CustomRouter from './custom/custom.router.js';
/* 
const router = Router();

router.get("/ ", getProducts);

export default router; */

export default class MockingRouter extends CustomRouter {
  init() {
    this.get('/', ['PUBLIC'], getProducts);
  }
}
