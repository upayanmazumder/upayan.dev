import Image from "next/image";
import React from 'react';
import headerStyles from "./header.module.css";

const Header: React.FC = () => {
    return (
        <header className={headerStyles.header}>
            <Image src="/upayan.svg" alt="logo" width={100} height={100} />
        </header>
    );
};

export default Header;