import React, { useContext } from 'react';

import { ReportContext } from '../../context/ReportContext';

import { AvarageSellerPrice } from '../../models/avarageSellerPrice';
import { PercentSells } from '../../models/percentage';

const SellersPage = () => {

    const { avarageSellers, percentage } = useContext(ReportContext)

    return (
        <div>
            <div>
                {
                avarageSellers.map((seller: AvarageSellerPrice) => 
                    <div key={seller.seller_type}>
                        <p>{seller.seller_type}</p>
                        <p>{seller.avaragePrice}</p>
                    </div>  
                    )
                }
            </div>
            <div>
                { 
                percentage.map((item: PercentSells) => 
                    <div key={item.id}>
                        <p>{item.make}</p>
                        <p>{item.percent}</p>
                    </div>
                    )
                }
            </div>
        </div>
    )
}

export default SellersPage