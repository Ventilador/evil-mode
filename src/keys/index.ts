/// File autogenerated by "[yarn|npm] run keys" script
const codes = [
    null,
    "<C-a>",
    "<C-b>",
    "<C-c>",
    "<C-d>",
    "<C-e>",
    "<C-f>",
    "<C-g>",
    "<C-h>",
    "<C-i>",
    "<C-j>",
    "<C-k>",
    "<C-l>",
    "<C-m>",
    "<C-n>",
    "<C-o>",
    "<C-p>",
    "<C-q>",
    "<C-r>",
    "<C-s>",
    "<C-t>",
    "<C-u>",
    "<C-v>",
    "<C-w>",
    "<C-x>",
    "<C-y>",
    "<C-z>",
    "<Esc>",
    "<C-Bslash>",
    "<C-]>",
    null,
    null,
    null,
    "<S-1>",
    "<S-'>",
    "<S-3>",
    "<S-4>",
    "<S-5>",
    "<S-7>",
    "'",
    "<S-9>",
    "<S-0>",
    "<S-8>",
    "<S-=>",
    ",",
    "-",
    ".",
    "/",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "<S-;>",
    ";",
    "<S-,>",
    "=",
    "<S-.>",
    "<S-/>",
    "<S-2>",
    "<S-a>",
    "<S-b>",
    "<S-c>",
    "<S-d>",
    "<S-e>",
    "<S-f>",
    "<S-g>",
    "<S-h>",
    "<S-i>",
    "<S-j>",
    "<S-k>",
    "<S-l>",
    "<S-m>",
    "<S-n>",
    "<S-o>",
    "<S-p>",
    "<S-q>",
    "<S-r>",
    "<S-s>",
    "<S-t>",
    "<S-u>",
    "<S-v>",
    "<S-w>",
    "<S-x>",
    "<S-y>",
    "<S-z>",
    "[",
    "<Bslash>",
    "]",
    "<S-6>",
    "<S-->",
    "`",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "<S-[>",
    "<S-Bslash>",
    "<S-]>",
    "<S-`>",
    "<C-0>",
    "<C-1>",
    "<C-2>",
    "<C-3>",
    "<C-4>",
    "<C-5>",
    "<C-6>",
    "<C-7>",
    "<C-8>",
    "<C-9>",
    "<C-`>",
    "<C-->",
    "<C-=>",
    "<C-[>",
    "<C-;>",
    "<C-'>",
    "<C-,>",
    "<C-.>",
    "<C-/>",
    "<C-)>",
    "<C-!>",
    "<C-@>",
    "<C-#>",
    "<C-$>",
    "<C-%>",
    "<C-^>",
    "<C-&>",
    "<C-*>",
    "<C-(>",
    "<C-~>",
    "<C-_>",
    "<C-+>",
    "<C-Q>",
    "<C-W>",
    "<C-E>",
    "<C-R>",
    "<C-T>",
    "<C-Y>",
    "<C-U>",
    "<C-I>",
    "<C-O>",
    "<C-P>",
    "<C-{>",
    "<C-}>",
    "<C-Bar>",
    "<C-A>",
    "<C-S>",
    "<C-D>",
    "<C-F>",
    "<C-G>",
    "<C-H>",
    "<C-J>",
    "<C-K>",
    "<C-L>",
    "<C-:>",
    "<C-\">",
    "<C-Z>",
    "<C-X>",
    "<C-C>",
    "<C-V>",
    "<C-B>",
    "<C-N>",
    "<C-M>",
    "<C-lt>",
    "<C->>",
    "<C-?>",
    "<A-0>",
    "<A-1>",
    "<A-2>",
    "<A-3>",
    "<A-4>",
    "<A-5>",
    "<A-6>",
    "<A-7>",
    "<A-8>",
    "<A-9>",
    "<A-`>",
    "<A-->",
    "<A-=>",
    "<A-q>",
    "<A-w>",
    "<A-e>",
    "<A-r>",
    "<A-t>",
    "<A-y>",
    "<A-u>",
    "<A-i>",
    "<A-o>",
    "<A-p>",
    "<A-[>",
    "<A-]>",
    "<A-Bslash>",
    "<A-a>",
    "<A-s>",
    "<A-d>",
    "<A-f>",
    "<A-g>",
    "<A-h>",
    "<A-j>",
    "<A-k>",
    "<A-l>",
    "<A-;>",
    "<A-'>",
    "<A-z>",
    "<A-x>",
    "<A-c>",
    "<A-v>",
    "<A-b>",
    "<A-n>",
    "<A-m>",
    "<A-,>",
    "<A-.>",
    "<A-/>"
];
export function fromChar(c: string) {
    if (c.length === 1) {
        return fromCode(c.charCodeAt(0));
    }

    throw new Error('Invalid');
}
export function fromCode(code: number) {
    if (code < 240) {
        const result = codes[code];
        if (result !== null){
            return result;
        }
    }

    throw new Error('Invalid');
}

