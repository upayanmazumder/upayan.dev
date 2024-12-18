import React from 'react';
import heroStyles from './details.module.css';
import Infobox from "../infobox/infobox";
import ContactForm from "../contact/contact";

const getUserAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const birthDate = new Date(2005, 9, 9);
const age = getUserAge(birthDate);

const Details = () => {
    return (
        <div className={heroStyles.hero}>
            <div id="about" className={heroStyles.card}>
                <Infobox title="About Me">
                    <p>
                        I&apos;m Upayan, a {age}-year-old student currently pursuing a BTech in Computer Science
                        with a specialization in Data Science at VIT Vellore. I have a deep passion for programming
                        and love exploring various technologies. My areas of interest range from web development to
                        data science, and I&apos;m always excited to work on new projects and expand my skillset.
                    </p>
                </Infobox>
            </div>

            <div id="interests" className={heroStyles.card}>
                <Infobox title="Interests">
                    <p>
                        I primarily focus on web development, but I also have experience in Discord bot development.
                        Recently, I&apos;ve been diving into Data Structures and Algorithms (DSA) and AI/ML projects.
                        In addition, I spend time experimenting with electronics, including the ESP32 microcontroller,
                        and I&apos;m looking forward to learning more about Arduino and Raspberry Pi.
                    </p>
                </Infobox>
            </div>

            <div id="contact" className={heroStyles.card}>
                <Infobox title="Contact">
                    <p>
                        Feel free to get in touch with me at <a href="mailto:contact@upayan.dev">contact@upayan.dev</a>.
                    </p>
                    <ContactForm />
                </Infobox>
            </div>
        </div>
    );
};

export default Details;