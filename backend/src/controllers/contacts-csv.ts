import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';

//types
import { ListingItem } from '../models/listingItem';
import { ContactItem } from '../models/contactItem';
import { createFilePath } from '../helpers/filePath';
import { TopSellersPerMonth } from '../models/topSellerPerMonth';
import { MostContacted } from '../models/mostContacted';

let listingsArray: ListingItem [] = [];
let contactArray: ContactItem [] = [];

//Find top 5 for a month
const findFiveTopSellers = (): TopSellersPerMonth[] => {
    const options = { month : 'numeric', year: 'numeric'};
    const convertedTime: ContactItem[] = [];
    const topSellersPerMonth: TopSellersPerMonth[] = [];
    
    //Convert UTC Timestamp(ms) to local time MM:YYYY
    contactArray.forEach(item => {
        convertedTime.push({
            listing_id: item.listing_id,
            contact_date: new Date(parseInt(item.contact_date)).toLocaleDateString('en-US', options),
        });
    });

    //Create a Set to avoid duplicated contact_date
    const monthsAndYears: Set<string> = new Set(convertedTime.map(dataSort => dataSort.contact_date));

    //Iterate over available dates
    monthsAndYears.forEach(dataToSearch => {

        //Filter all entries by contact_date
        const sortByMonth: ContactItem[] = convertedTime.filter(element => element.contact_date === dataToSearch);

        //Create set and reduce all sellers by id, 
        //avoid duplication and count occurrences for every seller
        const topItemsForMonth = sortByMonth.reduce((acc, val) => acc.set(val.listing_id, 1 + (acc.get(val.listing_id) || 0)), new Map());
        
        //Sort array of sellers by occurrences - 
        //descending from greater to lower and slice first 5 entries
        const topFiveSellers = Array.from(topItemsForMonth).sort((a, b) => b[1] - a[1]).slice(0, 5);

        //Create array topSellersPerMonth and push
        //every five element per month, create 
        //a object as in description
        topFiveSellers.forEach((seller, index )=> {
            const item = listingsArray.find(listing => listing.id === seller[0]);
            if(item){
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
}

//Find most contacted sellers
const calculateMostContacted = (): MostContacted => {

    //Create set and reduce all sellers by id
    //and count occurrences for every seller
    const mostContacted = contactArray.reduce((acc, val) => acc.set(val.listing_id, 1 + (acc.get(val.listing_id) || 0)), new Map());

    //Sort the array by occurrences - descending from greater to lower
    const sortedContacts = Array.from(mostContacted).sort((a, b) => b[1] - a[1]);

    //Slice only the top 30% of the contacted sellers
    const firstThirty = sortedContacts.slice(0, Math.trunc((30/ 100) * sortedContacts.length));
    
    //calculate total price from every entry in the top 30%
    let totalPrice: number = 0;
    firstThirty.forEach(element => {
        let currentItem: ListingItem | undefined = listingsArray.find(item => item.id === element[0]);
        if(currentItem){
            totalPrice = totalPrice + parseInt(currentItem.price);
        };
    });

    const mostContactedAvarage: MostContacted = {

        //Divided total price by sellers count in the first 30%
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
            const mostContacted: MostContacted = calculateMostContacted();
            const topSellers: TopSellersPerMonth[] = findFiveTopSellers();
            res.status(201).json({ mostContacted, topSellers});
    });
}

