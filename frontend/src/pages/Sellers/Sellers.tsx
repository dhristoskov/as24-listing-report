import React, { Fragment, useContext } from 'react';
import Loader from '../../components/Loader/Loader';

import { ReportContext } from '../../context/ReportContext';

import { AvarageSellerPrice } from '../../models/avarageSellerPrice';
import { PercentSells } from '../../models/percentage';

import './Sellers.scss'

const SellersPage = () => {

    const { avarageSellers, percentage } = useContext(ReportContext);

    return (
        <Fragment>
            {
                ( avarageSellers.length > 0 && percentage.length > 0 )
                ? <div className='seller-wrapper'>
                    <div className='seller-wrapper-avg'>
                        <h4 className='seller-wrapper-avg__title'>Average Listing Selling Price per Seller Type</h4>
                        <div className='seller-wrapper-avg__header'>
                            <p className='seller-wrapper-avg__header-item'>Sales Type</p>
                            <p className='seller-wrapper-avg__header-item'>Average in Euro</p>
                        </div>
                        {
                        avarageSellers.map((seller: AvarageSellerPrice, index: number) => 
                            <div key={seller.seller_type} className='seller-wrapper-avg__container' 
                            style={ index % 2 === 0 ? { backgroundColor: 'green'}: {}}>
                                <p className='seller-wrapper-avg__container-item'>{seller.seller_type}</p>
                                <p className='seller-wrapper-avg__container-item'>€ {seller.avaragePrice},-</p>
                            </div>  
                            )
                        }
                    </div>
                    <div className='seller-wrapper-percent'>
                        <h4 className='seller-wrapper-percent__title'>Percentual distribution of available cars by Make</h4>
                        <div className='seller-wrapper-percent__header'>
                            <p className='seller-wrapper-percent__header-item'>Make</p>
                            <p className='seller-wrapper-percent__header-item'>Distribution</p>
                        </div>
                        { 
                        percentage.map((item: PercentSells, index: number) => 
                            <div key={item.id} className='seller-wrapper-percent__container'
                            style={ index % 2 === 0 ? { backgroundColor: 'green'}: {}}>
                                <p className='seller-wrapper-percent__container-item'>{item.make}</p>
                                <p className='seller-wrapper-percent__container-item'>{item.percent} %</p>
                            </div>
                            )
                        }
                    </div>
                </div>
                : <Loader />
            }
        </Fragment>
    )
}

export default SellersPage