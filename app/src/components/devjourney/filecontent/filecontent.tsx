"use client";
import { marked } from "marked";
import hljs from "highlight.js";
import { useEffect } from "react";
import CopyButton from "../copybutton/copybutton";
import fileContentStyles from "./filecontent.module.css";
import "./code.css"; // using hljs devibeans

interface FileContentProps {
  fileContent: {
    name: string;
    content: string;
  } | null;
}

const FileContent: React.FC<FileContentProps> = ({ fileContent }) => {
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
        <div className={fileContentStyles.codeBlock}>
          <CopyButton text={fileContent.content} />
          <pre className={`${fileContentStyles.code} hljs`}>
            <code>{fileContent.content}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default FileContent;
