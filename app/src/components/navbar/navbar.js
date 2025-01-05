import React from 'react';
import { BsHouse, BsPatchCheck, BsCodeSlash } from 'react-icons/bs';
import Auth from "../auth/auth";
import navbarStyles from './navbar.module.css';

const Navbar = () => {
    const navItems = [
        { name: 'Home', href: '/', icon: BsHouse },
        { name: 'Certificates', href: '/certificates', icon: BsPatchCheck },
        { name: 'DevJourney', href: '/devjourney', icon: BsCodeSlash },
    ];

    const handleNavigation = (href) => {
        window.location.href = href;
    };

    return (
        <div className={navbarStyles.navbar}>
            <nav>
                <ul>
                    {navItems.map(({ name, href, icon: Icon }) => (
                        <li key={name}>
                            <button onClick={() => handleNavigation(href)}>
                                <Icon />{' '}
                                <span className={navbarStyles.buttonText}>{name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={navbarStyles.auth}>
                <Auth />
            </div>
        </div >
    );
};

export default Navbar;