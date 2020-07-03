import *as ctrl from './ctrl.json';
import *as shift from './shift.json';
import *as none from './none.json';
import *as alt from './alt.json';
import { Keystroke, Modifier } from '../types/api';
export class Keys {
    fromKeyStroke: (key: Keystroke) => string;
    fromKeyCode: (code: number) => string;
    getVimRepresentationOf: (code: number) => string;

    constructor() {
        this.fromKeyCode = this.createFromKeyCode();
        this.fromKeyStroke = this.createFromKeystroke();
        this.getVimRepresentationOf = null as any;
    }

    private createFromKeystroke(): (key: Keystroke) => string {
        //     const validCodes = this.getValidCodes();
        //     for (let i = 0; i < 12; i++) {
        //         validCodes.push({
        //             keycode: validCodes.length,
        //             modifier: [],
        //             pretty: `F${i + 1}`,
        //             text: 'unknown'
        //         });
        //     }
        //     const fnBody = `
        // var none = {};
        // var items = {};
        // return function (key){
        //     var mods = key.modifiers;
        //     var keycode = key.keycode|0;
        //     if(mods.length === 0) {
        //         if(keycode < mods.length) {
        //             return none[keycode]();
        //         }

        //         throw new Error('Out of bounds max value is ' + mods.length);
        //     }

        //     if(mods.length === 1) {
        //         const items = getItems(mods[0]);
        //         if(keycode > items.length) {
        //             return items[keycode]();
        //         }

        //         throw new Error('Out of bounds max value is ' + items.length);
        //     }

        //     throw new Error('Multi key not supported');
        // };

        // function getItems(mod){
        //     switch(mod) {
        //         case 'shift':
        //             return shift;
        //         case 'alt':
        //             return alt;
        //         case 'ctrl':
        //             return ctrl;
        //         case 'super':
        //             return super;
        //         default:
        //             throw new Error('Invalid modifier ' + mod);
        //     }
        // }`;
        return new Function('') as any;
    }
    //${asArray.map(i => '        ' + (i ? `function () { return { keycode: ${i.keycode}, text: ${JSON.stringify(i.text)}, modifier: ${getModifiers(i.modifier)}, pretty: ${JSON.stringify(i.pretty)} }; }` : 'invalidKey')).join(',\r\n')}
    private createFromKeyCode(): (code: number) => string {
        const asArray = this.getValidCodes();
        const fnBody = `    var codes = [
${asArray.map((key, index) => '        ' + (key ? `function () { return ${JSON.stringify(this.getVimKeyFromKeyStroke(key))} }` : 'invalidKey')).join(',\r\n')}
    ];
    return function (code){
        if(code < ${asArray.length}) {
            return codes[code]();
        }

        throw new Error('Out of bounds max value is ${asArray.length}');
    }
    function invalidKey(code) {
        throw new Error('Invalid key ' + code);
    }
`;

        return new Function(fnBody)();
    }

    private getValidCodes() {
        const allValidCodes: Record<string, Keystroke> = {};
        getCodesFrom(allValidCodes, ctrl, ['ctrl']);
        getCodesFrom(allValidCodes, shift, ['shift']);
        getCodesFrom(allValidCodes, alt, ['alt']);
        getCodesFrom(allValidCodes, none, []);
        const asArray: Keystroke[] = [];
        Object.keys(allValidCodes).forEach(key => {
            const code = +key;
            while (asArray.length < code) {
                asArray.push(null as any);
            }
            asArray[code] = allValidCodes[key];
        });
        return asArray;
    }

    private getVimKeyFromKeyStroke(key: Keystroke) {
        const val = this.getVimValidKey(key.text);
        if (val) {
            return val;
        }
        if (key.modifier.length === 0) {
            return this.getVimValidKey(key.pretty);
        } else if (key.modifier.length === 1) {
            let preamble = '<';
            switch (key.modifier[0]) {
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
            switch (key.pretty.length) {
                case 1:
                    let val = this.getVimValidKey(key.pretty);
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

    private getVimValidKey(val: string): string | undefined {
        switch (val.length) {
            case 1:
                if (keys.has(val)) {
                    return val;
                }
                if (val === '<') {
                    return '<lt>';
                }
                if (val === '\\') {
                    return '<Bslash>';
                }
                if (val === '|') {
                    return '<Bar>';
                }
                break;
            case 3:
                if (val === 'Esc') {
                    return `<${val}>`;
                }
            default:
                debugger;
        }
    }
}

const keys = new Set('~!@#$%^&*()_+}{":?>][=-123456678890-QWERTYUIOPASDFGHHJKLZXCCVBBNMM<>?<>?qwertyyuiioupasddfgghjjkl;kl\'zxcbcvbmn.,m,/.`~'.split(''));



export const KEYS = new Keys();

function getModifiers(mod: Modifier[]) {
    if (mod.length) {
        return `[${mod.map(j => JSON.stringify(j)).join(', ')}]`;
    }
    return '[]';
}

function getCodesFrom(codes: Record<string, Keystroke>, obj: any, modifier: Modifier[]) {
    Object.keys(obj).forEach(pretty => {
        const text: string = obj[pretty];
        if (text.length === 1) {
            const keycode = text.charCodeAt(0);
            codes[keycode] = { modifier, keycode, text, pretty };
        }
    });
}