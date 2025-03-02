"use client";
import { marked } from "marked";
import hljs from "highlight.js";
import { useEffect } from "react";
import fileContentStyles from "./FileContent.module.css";
import "./code.css"; // hljs devibeans

const FileContent = ({ fileContent }) => {
  useEffect(() => {
    if (fileContent?.content) hljs.highlightAll();
  }, [fileContent]);

  if (!fileContent) return null;

  return (
    <div className={fileContentStyles.contentContainer}>
      <h2 className={fileContentStyles.fileName}>{fileContent.name}</h2>
      {fileContent.name.endsWith(".md") ? (
        <div
          className={fileContentStyles.markdownContent}
          dangerouslySetInnerHTML={{ __html: marked(fileContent.content) }}
        />
      ) : (
        <pre className="hljs">
          <code>{fileContent.content}</code>
        </pre>
      )}
    </div>
  );
};

export default FileContent;
