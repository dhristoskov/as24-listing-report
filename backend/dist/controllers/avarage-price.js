"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvaragePriceData = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let listingsArray = [];
const createFilePath = (dir) => {
    return path_1.default.join(__dirname, '../data', dir);
};
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
const getAvaragePriceData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.createReadStream(createFilePath('listings.csv'))
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
});
exports.getAvaragePriceData = getAvaragePriceData;
//# sourceMappingURL=avarage-price.js.map