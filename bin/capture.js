// @ts-check
if (process.argv.includes('inspect')) {
    require('inspector').open(9229, undefined, true);
    debugger;
}
const keys = [
    'Esc',
    ...repeat(12, i => 'F' + i, 1),
    '`',
    ...repeat(9, i => i, 1),
    '0',
    '-',
    '=',
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    '[',
    ']',
    '\\',
    'a',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    ';',
    '\'',
    'z',
    'x',
    'c',
    'v',
    'b',
    'n',
    'm',
    ',',
    '.',
    '/'
];

function repeat(times, cb, from = 0) {
    times += from;
    const result = [];
    for (; from < times; from++) {
        result.push(cb(from));
    }
    return result;
}
const {
    createInterface
} = require('readline');
const {
    writeFileSync
} = require('fs');
const interface = createInterface(process.stdin, process.stdout);
interface.question('Modifier type: ', (mod) => {
    interface.close();
    process.stdin.resume();
    process.stdin.setRawMode(true);
    const iter = keys.values();
    const cache = {};
    let block = false;
    /** @type {IteratorResult<any, any>} */
    let currentResult;
    process.stdin.on('data', (key) => {
        if (block) {
            return;
        }
        block = true;
        if (currentResult && currentResult.value) {
            cache[currentResult.value] = key.toString();
        }
        next();
    });
    next();

    function next() {
        block = false;
        currentResult = iter.next();
        if (currentResult.done) {
            writeFileSync('src/keys/' + mod + '.json', JSON.stringify(cache, undefined, 2));
            process.stdin.pause();
        } else {
            process.stdout.write('\r\nPress "' + currentResult.value + '" key (with the modifier if any)');
        }
    }
});