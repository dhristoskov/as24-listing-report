"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contacts_csv_1 = require("../controllers/contacts-csv");
const listings_csv_1 = require("../controllers/listings-csv");
const router = express_1.Router();
router.get('/listings', listings_csv_1.getAvaragePriceAndPercentage);
router.get('/contacts', contacts_csv_1.getSellersInfo);
exports.default = router;
//# sourceMappingURL=auto-scout-router.js.map