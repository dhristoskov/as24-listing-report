import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';

import { ListingItem } from '../models/listingItem';
import { AvarageSellerPrice } from '../models/avarageSellerPrice';
import { PercentSells } from '../models/percentSells';
import { createFilePath } from '../helpers/filePath';

let listingsArray: ListingItem [] = [];

//Avarage price sellers in one array
const avaragePriceCalculation = (): AvarageSellerPrice [] => {
    let sellerArray: AvarageSellerPrice[] = [];
    const sellers: Set<string> = new Set(listingsArray.map(item => item.seller_type));
    Array.from(sellers).forEach((element) => {
        sellerArray.push(avaragePrice(element));
    });

    return sellerArray;
};

//Single avarage seller price calculating
const avaragePrice = (sellerType: string): AvarageSellerPrice => {
    const sellers: ListingItem [] = listingsArray.filter(seller => seller.seller_type === sellerType);
    const avaragePrice: number = sellers.map(item => parseInt(item.price))
                                .reduce((a:number, b:number) => a + b, 0) / sellers.length;
    
    const avarageSellerPrice: AvarageSellerPrice = {
        seller_type: sellerType,
        avaragePrice: Math.trunc(avaragePrice)
    }
    return avarageSellerPrice;
};

//Calculate sells per car maker
const carTypesPercent = (): PercentSells[] => {
    const percentSells: PercentSells[] = [];
    const makersCount = listingsArray.reduce((acc, val) => acc.set(val.make, 1 + (acc.get(val.make) || 0)), new Map());
    const totalSells: number = Array.from(makersCount).map(item => parseInt(item[1])).reduce((acc: number, val: number) => acc + val, 0);
    Array.from(makersCount).forEach((element, index) => {
        const percentItem: PercentSells = {
            id: index,
            make: element[0],
            percent: Math.trunc((100 * element[1]) / totalSells)
        }

        percentSells.push(percentItem);
    });

    return percentSells.sort((a, b) => b.percent - a.percent);
};

export const getAvaragePriceAndPercentage = (req: Request, res: Response) => {

    fs.createReadStream(createFilePath('listings.csv'))
        .pipe(csv())
        .on('data', (row) => {
            try {
                listingsArray.push(row);
            }catch(err) {
                console.error(err.message);
                res.status(500).send('Server Error!');
            }  
    })
        .on('end', () => {
            const avarageSellers: AvarageSellerPrice[] = avaragePriceCalculation()
            const percentage: PercentSells [] = carTypesPercent();
            res.status(201).json({ avarageSellers, percentage});
    }); 
};
