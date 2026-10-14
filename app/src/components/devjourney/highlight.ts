import { bundledLanguages, codeToHtml, type ShikiTransformer } from 'shiki';

const paneBackground: ShikiTransformer = {
  name: 'devjourney:pane-background',
  pre(node) {
    // The surrounding pane supplies `bg-surface` and padding.
    delete node.properties.style;
    delete node.properties.tabindex;
  },
};

const lineNumbers: ShikiTransformer = {
  name: 'devjourney:line-numbers',
  line(node, line) {
    node.children.unshift({
      type: 'element',
      tagName: 'span',
      properties: { class: 'ln', 'aria-hidden': 'true' },
      children: [{ type: 'text', value: String(line) }],
    });
  },
};

/** Server-side highlighted HTML; unknown language ids render as plain text. */
export async function highlight(
  code: string,
  language: string,
  withLineNumbers = true
): Promise<string> {
  return codeToHtml(code, {
    lang: language in bundledLanguages ? language : 'text',
    theme: 'github-dark-default',
    transformers: withLineNumbers ? [paneBackground, lineNumbers] : [paneBackground],
  });
}
