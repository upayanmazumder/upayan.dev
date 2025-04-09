/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./projects.module.css";
import projectsData from "../../data/projects.json";
import defaultImage from "../../media/icon.png";

const Projects = () => {
  return (
    <section id="projects" className={styles.projectsSection}>
      <h1 className={styles.heading}>Projects</h1>
      <div className={styles.projectsGrid}>
        {projectsData.map((project, index) => (
          <div key={index} className={styles.projectCard}>
            <img
              src={project.icon || defaultImage.src}
              alt={`${project.name} icon`}
              className={styles.projectIcon}
            />
            <div className={styles.projectContent}>
              <h2 className={styles.projectTitle}>{project.name}</h2>
              <p className={styles.projectDescription}>{project.description}</p>

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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
