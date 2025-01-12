import React from 'react';
import sidebarStyles from "./sidebar.module.css";
import Link from 'next/link';
import { BsHouse, BsLayers, BsPersonVcard, BsPatchCheck, BsCodeSlash, BsList } from "react-icons/bs"

const Sidebar: React.FC = () => {
    return (
        <aside className={sidebarStyles.sidebar}>
            <button aria-label="Toggle Sidebar" className={sidebarStyles.hamburger}>
                <BsList />
            </button>
            <nav>
                <ul>
                    <li>
                        <Link href="/">
                            <BsHouse />
                            <span>
                                Home
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/#projects">
                            <BsLayers />
                            <span>
                                Projects
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/#about-me">
                            <BsPersonVcard />
                            <span>
                                About me
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/certificates">
                            <BsPatchCheck />
                            <span>
                                Certificates
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/devjourney">
                            <BsCodeSlash />
                            <span>
                                DevJourney
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;