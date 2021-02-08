import React, { createContext, ReactNode, useState, useEffect } from 'react';

import axios from '../axios';

import { AvarageSellerPrice } from '../models/avarageSellerPrice';
import { MostContacted } from '../models/mostContacted';
import { PercentSells } from '../models/percentage';
import { TopSellersPerMonth } from '../models/topSellers';

type Props = {
    children: ReactNode
}

type ReportType = {
    avarageSellers: AvarageSellerPrice[];
    percentage: PercentSells[];
    mostContacted: MostContacted;
    topSellers: TopSellersPerMonth[];
}

export const ReportContext = createContext<ReportType>({} as ReportType);

const ReportContextProvider: React.FC<Props> = ({ children }) => {

    const [ avarageSellers, setAvarageSellers ] = useState<AvarageSellerPrice[]>([] as AvarageSellerPrice[]);
    const [ percentage, setPercentage ] = useState<PercentSells[]>([] as PercentSells[]);
    const [ mostContacted, setMostContacted ] = useState<MostContacted>({} as MostContacted);
    const [ topSellers, setTopSellers ] = useState<TopSellersPerMonth[]>([] as TopSellersPerMonth[]);

    useEffect(() => {
        axios.get('/listings') 
        .then(res => {
            setAvarageSellers(res.data.avarageSellers);
            setPercentage(res.data.percentage);
        }).catch(err => {
            console.log(err);
        });

        axios.get('/contacts') 
        .then(res => {
            setMostContacted(res.data.mostContacted);
            setTopSellers(res.data.topSellers);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    return (
        <ReportContext.Provider value={{ avarageSellers, percentage, mostContacted, topSellers }}>
            { children }
        </ReportContext.Provider>
    )
}

export default ReportContextProvider;