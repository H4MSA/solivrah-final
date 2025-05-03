
import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

// Define global colors for TypeScript
interface Colors {
  "neon-green": string;
  "soft-lime": string;
  "soft-purple": string;
  "electric-blue": string;
  "rich-black": string;
  "dark-purple": string;
}
