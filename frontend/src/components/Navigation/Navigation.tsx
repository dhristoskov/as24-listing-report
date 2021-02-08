import React from 'react';
import { NavLink } from 'react-router-dom'

import './Navigation.scss';

const Navigation = () => {
    return (
        <header className='header-main'>
            <nav className='header-main-nav'>
                <NavLink to='/sells'><li className='header-main-nav__item'>Sells Reports</li></NavLink>
                <NavLink to='/sellers'><li className='header-main-nav__item'>Sellers Reports</li></NavLink>
            </nav>
        </header>
        
    )
}

export default Navigation