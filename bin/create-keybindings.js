// @ts-check
require('./inspector');

const none = require('./key-maps/none.json');
const ctrl = require('./key-maps/ctrl.json');
const alt = require('./key-maps/alt.json');
const shift = require('./key-maps/shift.json');
const keys = new Set('~!@#$%^&*()_+}{":?>][=-123456678890-QWERTYUIOPASDFGHHJKLZXCCVBBNMM<>?<>?qwertyyuiioupasddfgghjjkl;kl\'zxcbcvbmn.,m,/.`~'.split(''));
const allValidCodes = {};
const json = require('./../package.json');
const writeFileSync = require('fs').writeFileSync;
const asArray = [];


json.contributes.keybindings = [{
    args: '27',
    command: 'evil.key',
    key: 'escape',
    when: ''
}];

getCodesFrom(allValidCodes, ctrl, ['ctrl']);
getCodesFrom(allValidCodes, shift, ['shift']);
getCodesFrom(allValidCodes, alt, ['alt']);
getCodesFrom(allValidCodes, none, []);
["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].forEach(i => {
    delete none[i];
    delete shift[i];
});

Object.keys(allValidCodes).forEach(key => {
    const code = +key;
    while (asArray.length < code) {
        asArray.push(null);
    }
    asArray[code] = allValidCodes[key];
});
const noNulls = asArray.filter(Boolean);
Object.keys(none).forEach(item => {
    const found = noNulls.find(i => i.modifier.includes('ctrl') && i.pretty === item);
    if (found) {
        json.contributes.keybindings.push({
            args: found.keycode,
            command: 'evil.key',
            key: 'ctrl+' + item
        });
    } else {
        const code = asArray.length;
        asArray.push({
            modifier: ['ctrl'],
            text: '',
            vim: getVimKeyFromKeyStroke(['ctrl'], item),
            keycode: code,
            pretty: item
        });
        json.contributes.keybindings.push({
            args: code.toString(),
            command: 'evil.key',
            key: 'ctrl+' + item
        });
    }
});

Object.keys(none).forEach(item => {
    // const found = noNulls.find(i => (i.modifier.includes('shift') && i.pretty === item) || (i.modifier.length === 0 && shift[item] === i.pretty));
    const code = asArray.length;
    asArray.push({
        modifier: ['ctrl'],
        text: '',
        vim: getVimKeyFromKeyStroke(['ctrl'], shift[item]),
        keycode: code,
        pretty: item
    });
    json.contributes.keybindings.push({
        args: code.toString(),
        command: 'evil.key',
        key: 'ctrl+shift+' + item
    });
});
Object.keys(none).forEach(item => {
    const found = noNulls.find(i => i.modifier.includes('alt') && i.pretty === item);
    if (found) {
        json.contributes.keybindings.push({
            args: found.keycode.toString(),
            command: 'evil.key',
            key: 'alt+' + item
        });
    } else {
        const code = asArray.length;
        asArray.push({
            modifier: ['alt'],
            vim: getVimKeyFromKeyStroke(['alt'], item),
            text: '',
            keycode: code,
            pretty: item
        });
        json.contributes.keybindings.push({
            args: code.toString(),
            command: 'evil.key',
            key: 'alt+' + item
        });
    }
});

function getCodesFrom(codes, obj, modifier) {
    Object.keys(obj).forEach(pretty => {
        const text = obj[pretty];
        if (text.length === 1) {
            const keycode = text.charCodeAt(0);
            codes[keycode] = {
                modifier,
                keycode,
                text,
                pretty
            };
        }
    });
}

function getVimKeyFromKeyStroke(modifier, pretty) {
    if (modifier.length === 0) {
        return getVimValidKey(pretty);
    } else if (modifier.length === 1) {
        let preamble = '<';
        switch (modifier[0]) {
            case 'alt':
                preamble += 'A-';
                break;
            case 'ctrl':
                preamble += 'C-';
                break;
            case 'shift':
                preamble += 'S-';
                break;
        }
        switch (pretty.length) {
            case 1:
                let val = getVimValidKey(pretty);
                if (val && val[0] === '<') {
                    val = val.slice(1, -1);
                }
                if (!val) {
                    debugger

                }
                preamble += val;
                break;
            default:
                debugger;
        }
        return preamble + '>';
    } else {
        debugger;
    }
    throw new Error('');
}

function getVimValidKey(val) {
    switch (val.length) {
        case 1:
            if (val === '<') {
                return '<lt>';
            }
            if (val === '\\') {
                return '<Bslash>';
            }
            if (val === '|') {
                return '<Bar>';
            }
            if (keys.has(val)) {
                return val;
            }
            case 3:
                if (val === 'Esc') {
                    return `<${val}>`;
                }
                default:
                    debugger;
    }
}
const ts = `/// File autogenerated by "[yarn|npm] run keys" script
const codes = [
    ${asArray.map(i=> i ? JSON.stringify(i.vim ? i.vim : getVimKeyFromKeyStroke(i.modifier, i.pretty)) : 'null').join(',\r\n    ')}
];
export function fromChar(c: string) {
    if (c.length === 1) {
        return fromCode(c.charCodeAt(0));
    }

    throw new Error('Invalid');
}
export function fromCode(code: number) {
    if (code < ${asArray.length}) {
        const result = codes[code];
        if (result !== null){
            return result;
        }
    }

    throw new Error('Invalid');
}

`;
debugger;

writeFileSync('src/keys/index.ts', ts);
const when = {
    when: "editorTextFocus"
};
json.contributes.keybindings = json.contributes.keybindings.map(i => Object.assign(i, when));

writeFileSync('package.json', JSON.stringify(json, undefined, 2));
