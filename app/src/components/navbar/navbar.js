import React from 'react';
import { BsHouse, BsBasket, BsPersonBadge, BsPatchCheck, BsCompass, BsPersonRolodex, BsCodeSlash } from 'react-icons/bs';
import Auth from "../auth/auth";
import navbarStyles from './navbar.module.css';

const Navbar = () => {
    const navItems = [
        { name: 'Home', href: '/', icon: BsHouse },
        { name: 'Services', href: '/#services', icon: BsBasket },
        { name: 'About', href: '/#about', icon: BsPersonBadge },
        { name: 'Certificates', href: '/certificates', icon: BsPatchCheck },
        { name: 'Interests', href: '/#interests', icon: BsCompass },
        { name: 'DevJourney', href: '/devjourney', icon: BsCodeSlash },
        { name: 'Contact', href: '/#contact', icon: BsPersonRolodex }
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
                                {name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <Auth />
        </div>
    );
};

export default Navbar;