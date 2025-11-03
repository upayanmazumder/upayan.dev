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
  const containerRef = useRef<HTMLDivElement>(null);

  // Configure marked for better markdown rendering
  useMemo(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }, []);

  // Detect language from file extension or filename
  const language = useMemo(() => {
    if (!fileContent?.name) return "plaintext";
    
    const filename = fileContent.name.toLowerCase();
    const ext = filename.split(".").pop() || "";
    
    // Check for specific filenames first
    const filenameMap: { [key: string]: string } = {
      "dockerfile": "dockerfile",
      "makefile": "makefile",
      "gemfile": "ruby",
      "rakefile": "ruby",
      "podfile": "ruby",
      "vagrantfile": "ruby",
      ".gitignore": "plaintext",
      ".dockerignore": "plaintext",
      ".env": "properties",
      ".editorconfig": "ini",
    };
    
    if (filenameMap[filename]) {
      return filenameMap[filename];
    }
    
    // Check file extensions
    const languageMap: { [key: string]: string } = {
      // JavaScript/TypeScript
      js: "javascript",
      jsx: "javascript",
      mjs: "javascript",
      cjs: "javascript",
      ts: "typescript",
      tsx: "typescript",
      
      // Python
      py: "python",
      pyw: "python",
      pyx: "python",
      
      // Java/JVM
      java: "java",
      kt: "kotlin",
      kts: "kotlin",
      scala: "scala",
      groovy: "groovy",
      
      // C/C++
      c: "c",
      h: "c",
      cpp: "cpp",
      cc: "cpp",
      cxx: "cpp",
      hpp: "cpp",
      hxx: "cpp",
      
      // C#/.NET
      cs: "csharp",
      fs: "fsharp",
      vb: "vbnet",
      
      // Web
      html: "html",
      htm: "html",
      xml: "xml",
      svg: "xml",
      css: "css",
      scss: "scss",
      sass: "sass",
      less: "less",
      
      // Shell
      sh: "bash",
      bash: "bash",
      zsh: "bash",
      fish: "bash",
      ps1: "powershell",
      psm1: "powershell",
      
      // Config/Data
      json: "json",
      jsonc: "json",
      json5: "json",
      yml: "yaml",
      yaml: "yaml",
      toml: "toml",
      ini: "ini",
      cfg: "ini",
      conf: "nginx",
      properties: "properties",
      
      // Markup
      md: "markdown",
      markdown: "markdown",
      rst: "restructuredtext",
      tex: "latex",
      
      // Other languages
      rb: "ruby",
      go: "go",
      rs: "rust",
      php: "php",
      swift: "swift",
      m: "objectivec",
      mm: "objectivec",
      vue: "vue",
      r: "r",
      sql: "sql",
      pl: "perl",
      pm: "perl",
      lua: "lua",
      vim: "vim",
      dart: "dart",
      elm: "elm",
      erl: "erlang",
      ex: "elixir",
      exs: "elixir",
      clj: "clojure",
      lisp: "lisp",
      hs: "haskell",
      ml: "ocaml",
      
      // Arduino/Hardware
      ino: "cpp",
      pde: "cpp",
      v: "verilog",
      vhd: "vhdl",
      vhdl: "vhdl",
      
      // Assembly
      asm: "x86asm",
      s: "x86asm",
    };

    return languageMap[ext] || "plaintext";
  }, [fileContent?.name]);

  // Render and highlight markdown content
  const renderedMarkdown = useMemo(() => {
    if (!fileContent?.content || !fileContent.name.endsWith(".md")) return "";
    
    const html = marked(fileContent.content) as string;
    return html;
  }, [fileContent?.content, fileContent?.name]);

  // Highlight markdown code blocks after rendering
  useEffect(() => {
    if (fileContent?.name.endsWith(".md") && containerRef.current) {
      // Highlight all code blocks in the rendered markdown within this container only
      const codeBlocks = containerRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
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

  const displayLanguage = language === "plaintext" ? "text" : language;

  return (
    <div className={fileContentStyles.contentContainer} ref={containerRef}>
      <h2 className={fileContentStyles.fileName}>{fileContent.name}</h2>
      {fileContent.name.endsWith(".md") ? (
        <div
          className={fileContentStyles.markdownContent}
          dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
        />
      ) : (
        <div className={fileContentStyles.codeBlock}>
          <CopyButton text={fileContent.content} />
          <span className={fileContentStyles.languageBadge}>{displayLanguage}</span>
          <pre className={fileContentStyles.code}>
            <code ref={codeRef} className={`hljs language-${language}`} />
          </pre>
        </div>
      )}
    </div>
  );
};

export default FileContent;
