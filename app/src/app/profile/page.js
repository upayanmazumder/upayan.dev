import React from 'react';

import SignOut from "../../components/auth/signout";
import styles from "../page.module.css";

const ProfilePage = () => {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h3>Profile Page</h3>
                <p>Welcome to your profile page!</p>
                <SignOut />
            </main>
        </div >
    );
};

export default ProfilePage;