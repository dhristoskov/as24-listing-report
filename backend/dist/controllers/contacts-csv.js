"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSellersInfo = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const filePath_1 = require("../helpers/filePath");
let listingsArray = [];
let contactArray = [];
//Find top 5 for a month
const findFiveTopSellers = () => {
    const options = { month: 'numeric', year: 'numeric' };
    const convertedTime = [];
    const sellersPerMonths = [];
    contactArray.forEach(item => {
        convertedTime.push({
            listing_id: item.listing_id,
            contact_date: new Date(parseInt(item.contact_date)).toLocaleDateString('en-US', options),
        });
    });
    const monthsAndYears = new Set(convertedTime.map(dataSort => dataSort.contact_date));
    monthsAndYears.forEach(dataToSearch => {
        const sortByMonth = convertedTime.filter(element => element.contact_date === dataToSearch);
        const topItemsForMonth = sortByMonth.reduce((acc, val) => acc.set(val.listing_id, 1 + (acc.get(val.listing_id) || 0)), new Map());
        const topFiveSellers = Array.from(topItemsForMonth).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topSellersPerMonth = [];
        topFiveSellers.forEach((seller, index) => {
            const item = listingsArray.find(listing => listing.id === seller[0]);
            topSellersPerMonth.push({
                ranking: index + 1,
                listing_id: seller[0],
                make: (item === null || item === void 0 ? void 0 : item.make) || '',
                selling_price: (item === null || item === void 0 ? void 0 : item.price) || '',
                mileage: (item === null || item === void 0 ? void 0 : item.mileage) || '',
                totalContacts: seller[1]
            });
        });
        sellersPerMonths.push(Object.assign({ month: dataToSearch }, topSellersPerMonth));
    });
    return sellersPerMonths;
};
//Find most contacted sellers
const calculateMostContacted = () => {
    const mostContacted = contactArray.reduce((acc, val) => acc.set(val.listing_id, 1 + (acc.get(val.listing_id) || 0)), new Map());
    const sortedContacts = Array.from(mostContacted).sort((a, b) => b[1] - a[1]);
    const firstThirty = sortedContacts.slice(0, Math.trunc((30 / 100) * sortedContacts.length));
    let totalPrice = 0;
    firstThirty.forEach(element => {
        let currentItem = listingsArray.find(item => item.id === element[0]);
        if (currentItem) {
            totalPrice = totalPrice + parseInt(currentItem.price);
        }
        ;
    });
    const mostContactedAvarage = {
        avaragePrice: Math.trunc(totalPrice / firstThirty.length)
    };
    return mostContactedAvarage;
};
const getSellersInfo = (req, res) => {
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
    });
    fs_1.default.createReadStream(filePath_1.createFilePath('contacts.csv'))
        .pipe(csv_parser_1.default())
        .on('data', (row) => {
        try {
            contactArray.push(row);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error!');
        }
    })
        .on('end', () => {
        const mostContacted = calculateMostContacted();
        const topSellers = findFiveTopSellers();
        res.status(201).json({ mostContacted, topSellers });
    });
};
exports.getSellersInfo = getSellersInfo;
//# sourceMappingURL=contacts-csv.js.map