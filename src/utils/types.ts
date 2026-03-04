/** Token value with Tailwind class mapping */
export interface TokenValue {
  value: string | number | string[];
  tailwind?: string;
  cssVar?: string;
  px?: number;
  rem?: string;
  size?: string;
  lineHeight?: string;
  [key: string]: unknown;
}

/** tokens.json root structure */
export interface Tokens {
  version: string;
  color: {
    primary: Record<string, TokenValue>;
    body: TokenValue;
    semantic: {
      light: Record<string, TokenValue>;
      dark: Record<string, TokenValue>;
    };
    status: Record<string, Record<string, TokenValue>>;
  };
  typography: {
    fontFamily: Record<string, TokenValue>;
    fontSize: Record<string, TokenValue>;
    fontWeight: Record<string, TokenValue>;
    letterSpacing: Record<string, TokenValue>;
    lineHeight: Record<string, TokenValue>;
  };
  spacing: Record<string, TokenValue>;
  elevation: Record<string, TokenValue>;
  radius: Record<string, TokenValue>;
  motion: {
    duration: Record<string, TokenValue>;
    easing: Record<string, TokenValue>;
  };
  zIndex: Record<string, TokenValue>;
}

/** Component variant */
export interface ComponentVariant {
  name: string;
  tailwind: string;
}

/** Component size */
export interface ComponentSize {
  name: string;
  tailwind: string;
}

/** Component accessibility spec */
export interface ComponentAccessibility {
  role: string;
  required: string[];
  focusRing: string;
}

/** Single component metadata */
export interface ComponentMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  docPath: string;
  variants: ComponentVariant[];
  sizes: ComponentSize[];
  accessibility: ComponentAccessibility;
  prohibited: string[];
  htmlSample: string;
}

/** components.json root structure */
export interface ComponentsData {
  version: string;
  components: ComponentMeta[];
}

/** Prohibition rule for check_rule */
export interface ProhibitionRule {
  pattern: string;
  reason: string;
  alternative: string;
}
