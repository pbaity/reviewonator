import { registerCustomTheme } from "@pierre/diffs";
import { bundledThemes } from "shiki/themes";

// GitHub's "-default" Shiki themes use github.com's syntax colours, but Shiki's TextMate grammars label
// some tokens differently from github.com's own highlighter. These rules recolour the most visible
// differences to what github.com shows: type names in the default text colour, properties in blue.
// TextMate picks the most specific matching scope, so they win over the base theme's broader rules.
const githubThemes = {
  "reviewonator-github-dark": { base: "github-dark-default", text: "#e6edf3", property: "#79c0ff" },
  "reviewonator-github-light": { base: "github-light-default", text: "#1f2328", property: "#0550ae" },
} as const;

export type SyntaxThemeName = keyof typeof githubThemes;

for (const [name, { base, text, property }] of Object.entries(githubThemes)) {
  registerCustomTheme(name, async () => {
    const theme = (await bundledThemes[base]()).default;
    return {
      ...theme,
      name,
      tokenColors: [
        ...(theme.tokenColors ?? []),
        { scope: ["entity.name.type"], settings: { foreground: text } },
        { scope: ["variable.object.property"], settings: { foreground: property } },
      ],
    };
  });
}
