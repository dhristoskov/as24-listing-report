import React, { useContext } from 'react';

import {ReportContext} from '../../context/ReportContext';

import { TopSellersPerMonth } from '../../models/topSellers';

const SellsPage = () => {

    const { mostContacted, topSellers } = useContext(ReportContext)

    return (
        <div>
            <div>{mostContacted.avaragePrice}</div>
            <div>
                {
                topSellers.map((seller: TopSellersPerMonth, index: number) => 
                    <div key={index}>
                        <h5>{seller.month}</h5>
                        <p>{seller.ranking}</p>
                        <p>{seller.listing_id}</p>
                        <p>{seller.make}</p>
                        <p>{seller.selling_price}</p>
                        <p>{seller.mileage}</p>
                        <p>{seller.totalContacts}</p>
                    </div>  
                )
            }
            </div>
        </div>
    )
}

export default SellsPage