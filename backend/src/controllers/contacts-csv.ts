import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';

import { ListingItem } from '../models/listingItem';
import { ContactItem } from '../models/contactItem';
import { createFilePath } from '../helpers/filePath';
import { TopSellersPerMonth } from '../models/topSellerPerMonth';

let listingsArray: ListingItem [] = [];
let contactArray: ContactItem [] = [];

//Find top 5 for a month
const findFiveTopSellers = () => {
    const options = { month : 'numeric', year: 'numeric'};
    const convertedTime: ContactItem[] = [];
    const sellersPerMonths: any[] = [];
    contactArray.forEach(item => {
        convertedTime.push({
            listing_id: item.listing_id,
            contact_date: new Date(parseInt(item.contact_date)).toLocaleDateString('en-US', options),
        });
    });

    const monthsAndYears: Set<string> = new Set(convertedTime.map(dataSort => dataSort.contact_date));

    monthsAndYears.forEach(dataToSearch => {
        const sortByMonth: ContactItem[] = convertedTime.filter(element => element.contact_date === dataToSearch);
        const topItemsForMonth = sortByMonth.reduce((acc, val) => acc.set(val.listing_id, 1 + (acc.get(val.listing_id) || 0)), new Map());
        const topFiveSellers = Array.from(topItemsForMonth).sort((a, b) => b[1] - a[1]).slice(0, 5);

        const topSellersPerMonth: TopSellersPerMonth[] = [];

        topFiveSellers.forEach((seller, index )=> {
            const item = listingsArray.find(listing => listing.id === seller[0]);
            topSellersPerMonth.push({
                ranking: index + 1,
                listing_id: seller[0],
                make: item?.make || '',
                selling_price: item?.price || '',
                mileage: item?.mileage || '',
                totalContacts: seller[1]
            });
        });

        sellersPerMonths.push({
            month: dataToSearch,
            ...topSellersPerMonth
        });
    });

    return sellersPerMonths;
}

//Find most contacted sellers
const calculateMostContacted = () => {
    const mostContacted = contactArray.reduce((acc, val) => acc.set(val.listing_id, 1 + (acc.get(val.listing_id) || 0)), new Map());
    const sortedContacts = Array.from(mostContacted).sort((a, b) => b[1] - a[1]);
    const firstThirty = sortedContacts.slice(0, Math.trunc((30/ 100) * sortedContacts.length));
    
    let totalPrice: number = 0;
    firstThirty.forEach(element => {
        let currentItem: ListingItem | undefined = listingsArray.find(item => item.id === element[0]);
        if(currentItem){
            totalPrice = totalPrice + parseInt(currentItem.price);
        };
    });

    const mostContactedAvarage = {
        avaragePrice: Math.trunc(totalPrice/ firstThirty.length)
    };

    return mostContactedAvarage;
}

export const getSellersInfo = (req: Request, res: Response) => {

    fs.createReadStream(createFilePath('listings.csv'))
        .pipe(csv())
        .on('data', (row) => {
            try {
                listingsArray.push(row);
            }catch(err) {
                console.error(err.message);
                res.status(500).send('Server Error!');
            }  
    });

    fs.createReadStream(createFilePath('contacts.csv'))
        .pipe(csv())
        .on('data', (row) => {
            try {
                contactArray.push(row);
            }catch(err) {
                console.error(err.message);
                res.status(500).send('Server Error!');
            }  
    })
        .on('end', () => {
            const mostContacted = calculateMostContacted();
            const topSellers = findFiveTopSellers();
            res.status(201).json({ mostContacted, topSellers});
    });
}

