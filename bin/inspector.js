if (process.argv.includes('inspect') || process.argv.includes('-i')) {
    require('inspector').open(9229, undefined, true);
}