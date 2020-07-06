const {
    writeFileSync
} = require('fs');
require('./inspector');

const from = 32;
const to = 126;
const fromType = Array.from(new Array(to - from + 1 /*inclusive*/ )).map((_, i) => i + from).map(code => ({
    code,
    char: String.fromCharCode(code)
}));
const shifts = [
    
];
writeFileSync('bin/key-maps/from-type.json', JSON.stringify(fromType, undefined, 2));
