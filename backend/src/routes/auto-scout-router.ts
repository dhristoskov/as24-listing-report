import { Router } from 'express';

import { getSellersInfo } from '../controllers/contacts-csv';
import { getAvaragePriceAndPercentage } from '../controllers/listings-csv';

const router = Router();

router.get('/listings', getAvaragePriceAndPercentage);

router.get('/contacts', getSellersInfo);

export default router