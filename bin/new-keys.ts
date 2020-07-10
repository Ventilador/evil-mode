import './inspector';
import { writeFileSync } from 'fs';
type Key = {
    args: string;
    command: string;
    key: string;
    when: string;
};

const when = 'editorTextFocus';
const command = 'evil.nvim_input';
const escape_key = String.fromCharCode(27);

// const from = 32;
// const to = 126;
// const vimKeys: string[] = [];
// const fromType = Array.from(new Array(to - from + 1 /*inclusive*/)).map((_, i) => i + from).map(code => ({
//     code,
//     char: String.fromCharCode(code)
// }));
// writeFileSync('bin/key-maps/from-type.json', JSON.stringify(fromType, undefined, 2));
const json = require('./../package.json');
const ctrl = require('./key-maps/ctrl.json');
const shift = require('./key-maps/shift.json');

json.contributes.keybindings = [];
// vscode keys from https://code.visualstudio.com/docs/getstarted/keybindings
// search *The following keys are accepted:*
// vim keys from https://neovim.io/doc/user/intro.html#keycodes
// search *<Nul>		zero	*
addKeyBinding('tab', '<Tab>');
addKeyBinding('escape', '<Esc>');
addKeyBinding('delete', '<Del>');
addKeyBinding('insert', '<Insert>');
addKeyBinding('left', '<Left>');
addKeyBinding('right', '<Right>');
addKeyBinding('up', '<Up>');
addKeyBinding('down', '<Down>');
addKeyBinding('pageup', '<PageUp>');
addKeyBinding('pagedown', '<PageDown>');
addKeyBinding('home', '<Home>');
addKeyBinding('end', '<End>');
addKeyBinding('ctrl+space', '<C-Space>');

// '    backspace delete'.split(' ').forEach(addKeyBinding);
// 'left up right down pageup pagedown end home'.split(' ').forEach(addKeyBinding);
Object.keys(ctrl).forEach(key => {
    if (/F\d+/.test(key)) {
        return;
    }
    const vim = mapInvalidKeys(key);
    addKeyBinding('ctrl+' + key, `<C-${vim}>`);
});
debugger;
Object.keys(shift).forEach(key => {
    if (/F\d+/.test(key)) {
        return;
    }
    const vim = mapInvalidKeys(shift[key]);

    if (vim.length === 1 && vim.charCodeAt(0) >= 65 && vim.charCodeAt(0) <= 90) {
        addKeyBinding('ctrl+shift+' + key, `<C-${vim}>`);
    } else if (key === 'Esc') {
        return;
    } else {
        addKeyBinding('ctrl+' + shift[key], `<C-${vim}>`);
    }
});

writeFileSync('package.json', JSON.stringify(json, undefined, 2));

function addKeyBinding(key: string, args: string) {
    json.contributes.keybindings.push({ key, command, when, args });
}
function mapInvalidKeys(key: string) {
    switch (key) {
        case '<':
            return 'lt';
        case '|':
            return 'Bar';
        case '\\':
            return 'Bslash';
        case ' ':
            return 'Space';
        case '\r':
        case '\n':
            return 'CR';
        case '\t':
            return 'Tab';
        case escape_key:
            return 'Esc';
        default:
            return key;
    }
}
