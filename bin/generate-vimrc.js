require('./inspector');
const {
    readFileSync,
    writeFileSync
} = require('fs');
debugger;
const content = readFileSync('src/base-options.vim', 'utf8');
writeFileSync('src/utils/vimrc.ts', `const baseOptions = [
    ${content.split('\n').filter(i=> i.trim()[0] !== '"').filter(Boolean).map(i=> JSON.stringify(i)).join(',\r\n    ')}
];
export { baseOptions };
`);