// @ts-check
require('./inspector');

const neo = require('neovim');
const child = require('child_process');
const {
    writeFileSync
} = require('fs');

const nvim_proc = child.spawn('nvim', ['-u', 'NONE', '-N', '--embed'], {});
const vim = neo.attach({
    proc: nvim_proc
});

vim.requestApi().then(res => {
        const api = res[1];

        return `import { EventEmitter } from 'events';        
export interface Vim extends EventEmitter{
    ${getEvents(api)}
    ${getMethods(api)}
    quit(): Promise<void>;
    raw(value: string | Uint8Array): void;
}`;
    })
    .then(content => {
        vim.quit();
        writeFileSync('src/types/api.ts', content);
    });

function getEvents({
    ui_events
}) {
    return ui_events.map(({
        name,
        parameters
    }, i) => {
        return `on(eventName: "${name}", cb: (${parameters.length? `args: [${parameters.map(j=> `${getTypeFor(j[0])}/*${j[1]}*/`).join(', ')}]`:''}) => any): this`;
    }).join('\r\n\t');
}

function getMethods({
    functions
}) {
    return functions.map(i => {
        return `${i.name}(${i.parameters.map(j=> `${j[1]}: ${getTypeFor(j[0])}`).join(', ')}): Promise<${getTypeFor(i.return_type)}>;`;
    }).join('\r\n\t');
}

function getTypeFor(val) {
    switch (val) {
        case 'Boolean':
        case 'Number':
        case 'String':
        case 'void':
            return val.toLowerCase();
        case 'Integer':
        case 'Float':
            return 'number';
        case 'Object':
            return 'any';
        case 'Dictionary':
            return 'Record<string, any>';
        case 'Array':
            return 'any[]';
        case 'Buffer':
        case 'Window':
        case 'Tabpage':
            return 'import(\'neovim\').' + val;
        default:
            const result = /ArrayOf\(([^,]+)(,\s\d+)?\)/.exec(val);
            if (result) {
                return `${getTypeFor(result[1])}[]`;
            }

    }
    debugger;

    throw new Error('asd');
}
