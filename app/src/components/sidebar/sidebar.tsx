import React from 'react';
import sidebarStyles from "./sidebar.module.css";
import Link from 'next/link';
import { BsHouse, BsLayers, BsPersonVcard, BsPatchCheck, BsCodeSlash } from "react-icons/bs";
import sidebarData from '../../data/navigation.json';

const iconMap = {
    BsHouse: <BsHouse />,
    BsLayers: <BsLayers />,
    BsPersonVcard: <BsPersonVcard />,
    BsPatchCheck: <BsPatchCheck />,
    BsCodeSlash: <BsCodeSlash />
};

const Sidebar: React.FC = () => {
    return (
        <aside className={sidebarStyles.sidebar}>
            <nav>
                <ul>
                    {sidebarData.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href}>
                                {iconMap[item.icon]}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;