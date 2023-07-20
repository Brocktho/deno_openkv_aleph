/** @format */

import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

import { asset, css } from "../../assets.ts";
const Retro = asset("../retro.css", css);

marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight: function (code: unknown, lang: unknown) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

export const MarkdownStyles = [
  {
    rel: "stylesheet",
    href:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css",
  },
  {
    rel: "stylesheet",
    href: Retro,
  },
];

export default marked;
