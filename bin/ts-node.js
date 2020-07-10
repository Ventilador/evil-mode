// @ts-check
if (process.argv.includes('inspect')) {
    process.argv.splice(process.argv.indexOf('inspect'), 1);
    require('inspector').open(9229, undefined, true);
} else if (process.argv.includes('-i')) {
    process.argv.splice(process.argv.indexOf('-i'), 1);
    require('inspector').open(9229, undefined, true);
}
require('ts-node/register/transpile-only');
const resolve = require('path').resolve;
require(resolve(__dirname, process.argv[2]));
