import React, { useContext, Fragment } from 'react';
import Loader from '../../components/Loader/Loader';

import { ReportContext } from '../../context/ReportContext';

import { TopSellersPerMonth } from '../../models/topSellers';

import './Sells.scss';

const SellsPage = () => {

    const { mostContacted, topSellers, loading } = useContext(ReportContext)

    return (
        <Fragment>
            {
                loading 
                ? <Loader />
                : <div className='sells-wrapper'>
                    <div className='sells-wrapper-contact'>
                        <h4 className='sells-wrapper-contact__title'>Average price of the 30% most contacted listings</h4>
                        <p className='sells-wrapper-contact__header'>Average price</p>
                        <p className='sells-wrapper-contact__item'>€ {mostContacted.avaragePrice},-</p>
                    </div>
                    <div className='sells-wrapper-sellers'>
                        <h4 className='sells-wrapper-sellers__title'>Average Listing Selling Price per Seller Type</h4>
                        {
                        topSellers.map((seller: TopSellersPerMonth, index: number) => 
                        <div key={index}>
                            {
                                seller.ranking === 1 && 
                                <Fragment>
                                    <p className='sells-wrapper-sellers__month'>Month: {seller.month}</p>
                                     <div className='sells-wrapper-sellers__header'>
                                        <p className='sells-wrapper-sellers__header-item'>Ranking</p>
                                        <p className='sells-wrapper-sellers__header-item'>Listing Id</p>
                                        <p className='sells-wrapper-sellers__header-item'>Make</p>
                                        <p className='sells-wrapper-sellers__header-item'>Selling Price</p>
                                        <p className='sells-wrapper-sellers__header-item'>Mileage</p>
                                        <p className='sells-wrapper-sellers__header-item'>Total Contacts</p>
                                    </div>
                                </Fragment>
                                
                            }
                            <div className='sells-wrapper-sellers__container'
                                style={ seller.ranking % 2 === 0 ? { backgroundColor: 'green'}: {}}>
                                    <p className='sells-wrapper-sellers__container-item'>{seller.ranking}</p>
                                    <p className='sells-wrapper-sellers__container-item'>{seller.listing_id}</p>
                                    <p className='sells-wrapper-sellers__container-item'>{seller.make}</p>
                                    <p className='sells-wrapper-sellers__container-item'>€ {seller.selling_price},-</p>
                                    <p className='sells-wrapper-sellers__container-item'>{seller.mileage} KM</p>
                                    <p className='sells-wrapper-sellers__container-item'>{seller.totalContacts}</p>
                            </div> 
                        </div>
                         
                        )
                    }
                    </div>
                </div>
            }
        </Fragment>
    )
}

export default SellsPage