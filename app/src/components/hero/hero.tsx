import React from 'react';
import heroStyles from "./hero.module.css";
import Image from "next/image";
import technologies from "../../data/technologies.json";

const Hero: React.FC = () => {
    return (
        <div className={heroStyles.hero}>
            <ul className={heroStyles.branding}>
                <Image src="/upayan-transparent.svg" alt="logo" width={200} height={200} />
                <ul className={heroStyles.technologies}>
                    {technologies.map((technology, index) => (
                        <li key={index} style={{ color: technology.textColor, backgroundColor: technology.backgroundColor }} className={heroStyles.technology}>
                            {technology.name}
                        </li>
                    ))}
                </ul>
            </ul>
        </div>
    );
};

export default Hero;