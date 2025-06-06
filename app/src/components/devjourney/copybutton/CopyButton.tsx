"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import copyButtonStyles from "./CopyButton.module.css";

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button className={copyButtonStyles.copyButton} onClick={handleCopy}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? " Copied!" : " Copy"}
    </button>
  );
};

export default CopyButton;
