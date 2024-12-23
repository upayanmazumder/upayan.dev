'use client'

import Image from "next/image";
import styles from "./page.module.css";
import SocialMediaWork from "../components/social-media/work/work";
import Activity from "../components/activity/activity";
import Carousel from "../components/carousel/carousel";
import Details from "../components/details/details";
import Projects from "../components/projects/projects";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SocialMediaWork />
        <Activity />
        <Carousel />
        <Projects />
        <Details />
      </main>
    </div>
  );
}
