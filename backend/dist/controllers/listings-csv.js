"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvaragePriceAndPercentage = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const filePath_1 = require("../helpers/filePath");
let listingsArray = [];
//Avarage price sellers in one array
const avaragePriceCalculation = () => {
    let sellerArray = [];
    const sellers = new Set(listingsArray.map(item => item.seller_type));
    Array.from(sellers).forEach((element) => {
        sellerArray.push(avaragePrice(element));
    });
    return sellerArray;
};
//Single avarage seller price calculating
const avaragePrice = (sellerType) => {
    const sellers = listingsArray.filter(seller => seller.seller_type === sellerType);
    const avaragePrice = sellers.map(item => parseInt(item.price))
        .reduce((a, b) => a + b, 0) / sellers.length;
    const avarageSellerPrice = {
        seller_type: sellerType,
        avaragePrice: Math.trunc(avaragePrice)
    };
    return avarageSellerPrice;
};
//Calculate sells per car maker
const carTypesPercent = () => {
    const percentSells = [];
    const makersCount = listingsArray.reduce((acc, val) => acc.set(val.make, 1 + (acc.get(val.make) || 0)), new Map());
    const totalSells = Array.from(makersCount).map(item => parseInt(item[1])).reduce((acc, val) => acc + val, 0);
    Array.from(makersCount).forEach((element, index) => {
        const percentItem = {
            id: index,
            make: element[0],
            percent: Math.trunc((100 * element[1]) / totalSells)
        };
        percentSells.push(percentItem);
    });
    return percentSells.sort((a, b) => b.percent - a.percent);
};
const getAvaragePriceAndPercentage = (req, res) => {
    fs_1.default.createReadStream(filePath_1.createFilePath('listings.csv'))
        .pipe(csv_parser_1.default())
        .on('data', (row) => {
        try {
            listingsArray.push(row);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error!');
        }
    })
        .on('end', () => {
        const avarageSellers = avaragePriceCalculation();
        const percentage = carTypesPercent();
        res.status(201).json({ listings: avarageSellers, percentage });
    });
};
exports.getAvaragePriceAndPercentage = getAvaragePriceAndPercentage;
//# sourceMappingURL=listings-csv.js.map