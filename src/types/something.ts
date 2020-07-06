
export interface VimHighlightUIAttributes {
    hi_name: string;
    foreground: number;
    background: number;
    id: number;
    kind: string;
    special: number;
    reverse?: boolean;
    italic?: boolean;
    bold?: boolean;
    strikethrough?: boolean;
    // has special color
    underline?: boolean;
    // has special color
    undercurl?: boolean;
    blend?: number;
}
