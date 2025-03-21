/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './projects.module.css';
import projectsData from '../../data/projects.json';

const Projects = () => {
  return (
    <div id='projects' className={styles.container}>
      {projectsData.map((project, index) => (
        <div key={index} className={styles.project}>
          <div>
            <img src={project.icon} alt={`${project.name} icon`} />
            <h2>{project.name}</h2>
          </div>
          <p>{project.description}</p>
          <div className={styles.links}>
            {project.links.map((link, linkIndex) => (
              <a key={linkIndex} href={link.url} className={styles.link} target="_blank" rel="noopener noreferrer">
                {link.name}
              </a>
            ))}
          </div>
          {project.packageLinks && (
            <div className={styles.packageLinks}>
              {project.packageLinks.map((packageLink, packageLinkIndex) => (
                <a key={packageLinkIndex} href={packageLink.url} className={styles.packageLink} target="_blank" rel="noopener noreferrer">
                  {packageLink.name}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Projects;