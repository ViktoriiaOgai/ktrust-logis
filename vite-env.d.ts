/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "*.svg?react" {
import * as React from "react";

const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

export default ReactComponent;
}

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}