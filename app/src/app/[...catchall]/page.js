import Image from "next/image";
import styles from "../page.module.css";

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>404</h1>
                <p>The page you are looking for does not exist!</p>
            </main>
        </div>
    );
}
