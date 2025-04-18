// filepath: d:\upayanmazumder\upayan.dev\app\src\components\projects\projects.tsx
import React from "react";
import Image from "next/image";
import styles from "./projects.module.css";
import projectsData from "../../data/projects.json";
import defaultImage from "../../media/icon.png";
import Card from "../ui/card/card";

const Projects = () => {
  return (
    <section id="projects" className={styles.projectsSection}>
      <h1 className={styles.heading}>Projects</h1>
      <div className={styles.projectsGrid}>
        {projectsData.map((project, index) => (
          <Card
            key={index}
            title={project.name}
            content={
              <>
                <Image
                  src={project.icon || defaultImage.src}
                  alt={`${project.name} icon`}
                  className={styles.projectIcon}
                />
                <p className={styles.projectDescription}>
                  {project.description}
                </p>

                <div className={styles.linkGroup}>
                  {project.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkButton}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>

                {project.packageLinks && (
                  <div className={styles.packageGroup}>
                    {project.packageLinks.map((pkg, i) => (
                      <a
                        key={i}
                        href={pkg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.packageButton}
                      >
                        {pkg.name}
                      </a>
                    ))}
                  </div>
                )}
              </>
            }
            className={styles.projectCard}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
