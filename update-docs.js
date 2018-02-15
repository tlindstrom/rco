/*
    This script copies the dist folder to the docs folder (which is the one served by github pages)
*/

let rimraf = require('rimraf');
let fs = require('fs-extra');

rimraf.sync(__dirname + '/docs');
fs.copySync(__dirname + '/dist', __dirname + '/docs');

console.log('\nUPDATED DOCS FOLDER\n');