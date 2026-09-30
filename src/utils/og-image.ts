import sharp from "sharp";
import { THEME_HEX, type ThemeColor } from "~/utils/colors.constants";

const width = 1200;
const height = 630;
const textWidth = 1020;

function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });
}

function estimatedWidth(text: string, fontSize: number): number {
  return [...text].reduce((width, character) => {
    if ("ilI1.,:;!'| ".includes(character)) return width + fontSize * 0.29;
    if ("MW@%".includes(character)) return width + fontSize * 0.9;
    return width + fontSize * (/[A-Z]/.test(character) ? 0.68 : 0.56);
  }, 0);
}

function wrapTitle(title: string, fontSize: number): string[] {
  const lines: string[] = [];
  let line = "";

  for (const word of title.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && estimatedWidth(candidate, fontSize) > textWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines;
}

export async function createOgImage(
  title: string,
  color: ThemeColor,
): Promise<Buffer> {
  let fontSize = 84;
  let lines = wrapTitle(title, fontSize);

  while (
    fontSize > 40 &&
    (lines.length * fontSize * 1.16 > 370 ||
      lines.some((line) => estimatedWidth(line, fontSize) > textWidth))
  ) {
    fontSize -= 4;
    lines = wrapTitle(title, fontSize);
  }

  const lineHeight = fontSize * 1.16;
  const firstBaseline = 90 + (370 - lines.length * lineHeight) / 2 + fontSize;
  const titleLines = lines
    .map(
      (line, index) =>
        `<text x="80" y="${firstBaseline + index * lineHeight}" font-size="${fontSize}" font-weight="800">${escapeXml(line)}</text>`,
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${THEME_HEX[color]}" />
    <g fill="#131513" font-family="Arial, Helvetica, sans-serif">${titleLines}
      <path d="M80 497h1040" stroke="#131513" stroke-width="3" />
      <text x="80" y="561" font-size="36" font-weight="700">Ben Basten</text>
    </g>
  </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}
