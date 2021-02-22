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
    const topSellersPerMonth = [];
    //Convert UTC Timestamp(ms) to local time MM:YYYY
    contactArray.forEach(item => {
        convertedTime.push({
            listing_id: item.listing_id,
            contact_date: new Date(parseInt(item.contact_date)).toLocaleDateString('en-US', options),
        });
    });
    //Create a Set to avoid duplicated contact_date
    const monthsAndYears = new Set(convertedTime.map(dataSort => dataSort.contact_date));
    //Iterate over available dates
    monthsAndYears.forEach(dataToSearch => {
        //Filter all entries by contact_date
        const sortByMonth = convertedTime.filter(element => element.contact_date === dataToSearch);
        //Create set and reduce all sellers by id, 
        //avoid duplication and count occurrences for every seller
        const topItemsForMonth = sortByMonth.reduce((acc, val) => acc.set(val.listing_id, 1 + (acc.get(val.listing_id) || 0)), new Map());
        //Sort array of sellers by occurrences - 
        //descending from greater to lower and slice first 5 entries
        const topFiveSellers = Array.from(topItemsForMonth).sort((a, b) => b[1] - a[1]).slice(0, 5);
        //Create array topSellersPerMonth and push
        //every five element per month, create 
        //a object as in description
        topFiveSellers.forEach((seller, index) => {
            const item = listingsArray.find(listing => listing.id === seller[0]);
            if (item) {
                topSellersPerMonth.push({
                    month: dataToSearch,
                    ranking: index + 1,
                    listing_id: seller[0],
                    make: item.make,
                    selling_price: item.price,
                    mileage: item.mileage,
                    totalContacts: seller[1]
                });
            }
        });
    });
    //Sort the array by month of the year - ascending from lower to greater
    return topSellersPerMonth.sort((a, b) => parseInt(a.month) - parseInt(b.month));
};
//Find most contacted sellers
const calculateMostContacted = () => {
    //Create set and reduce all sellers by id
    //and count occurrences for every seller
    const mostContacted = contactArray.reduce((acc, val) => acc.set(val.listing_id, 1 + (acc.get(val.listing_id) || 0)), new Map());
    //Sort the array by occurrences - descending from greater to lower
    const sortedContacts = Array.from(mostContacted).sort((a, b) => b[1] - a[1]);
    //Slice only the top 30% of the contacted sellers
    const firstThirty = sortedContacts.slice(0, Math.trunc((30 / 100) * sortedContacts.length));
    //calculate total price from every entry in the top 30%
    let totalPrice = 0;
    firstThirty.forEach(element => {
        let currentItem = listingsArray.find(item => item.id === element[0]);
        if (currentItem) {
            totalPrice = totalPrice + parseInt(currentItem.price);
        }
        ;
    });
    const mostContactedAvarage = {
        //Divided total price by sellers count in the first 30%
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