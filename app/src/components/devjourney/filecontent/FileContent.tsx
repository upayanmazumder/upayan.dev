"use client";
import { marked } from "marked";
import hljs from "highlight.js";
import { useEffect, useRef, useMemo } from "react";
import CopyButton from "../copybutton/CopyButton";
import fileContentStyles from "./FileContent.module.css";
import "./code.css"; // using hljs devibeans

interface FileContentProps {
  fileContent: {
    name: string;
    content: string;
  } | null;
}

const FileContent: React.FC<FileContentProps> = ({ fileContent }) => {
  const codeRef = useRef<HTMLElement>(null);

  // Configure marked for better markdown rendering
  useMemo(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }, []);

  // Detect language from file extension
  const language = useMemo(() => {
    if (!fileContent?.name) return "plaintext";
    
    const ext = fileContent.name.split(".").pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      rb: "ruby",
      go: "go",
      rs: "rust",
      php: "php",
      swift: "swift",
      kt: "kotlin",
      sh: "bash",
      bash: "bash",
      zsh: "bash",
      yml: "yaml",
      yaml: "yaml",
      json: "json",
      xml: "xml",
      html: "html",
      css: "css",
      scss: "scss",
      sass: "sass",
      sql: "sql",
      r: "r",
      m: "objectivec",
      h: "c",
      hpp: "cpp",
      vue: "vue",
      dockerfile: "dockerfile",
      makefile: "makefile",
    };

    return languageMap[ext || ""] || "plaintext";
  }, [fileContent?.name]);

  // Render and highlight markdown content
  const renderedMarkdown = useMemo(() => {
    if (!fileContent?.content || !fileContent.name.endsWith(".md")) return "";
    
    const html = marked(fileContent.content) as string;
    return html;
  }, [fileContent?.content, fileContent?.name]);

  // Highlight markdown code blocks after rendering
  useEffect(() => {
    if (fileContent?.name.endsWith(".md")) {
      // Highlight all code blocks in the rendered markdown
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [renderedMarkdown, fileContent?.name]);

  // Highlight code when content or language changes
  useEffect(() => {
    if (codeRef.current && fileContent?.content && !fileContent.name.endsWith(".md")) {
      try {
        const highlighted = hljs.highlight(fileContent.content, {
          language,
          ignoreIllegals: true,
        });
        codeRef.current.innerHTML = highlighted.value;
      } catch (err) {
        console.error("Syntax highlighting error:", err);
        codeRef.current.textContent = fileContent.content;
      }
    }
  }, [fileContent?.content, language, fileContent?.name]);

  if (!fileContent) return null;

  return (
    <div className={fileContentStyles.contentContainer}>
      <h2 className={fileContentStyles.fileName}>{fileContent.name}</h2>
      {fileContent.name.endsWith(".md") ? (
        <div
          className={fileContentStyles.markdownContent}
          dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
        />
      ) : (
        <div className={fileContentStyles.codeBlock}>
          <CopyButton text={fileContent.content} />
          <pre className={fileContentStyles.code}>
            <code ref={codeRef} className={`hljs language-${language}`} />
          </pre>
        </div>
      )}
    </div>
  );
};

export default FileContent;
