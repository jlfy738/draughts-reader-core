const fs = require('fs');
const gulp = require('gulp');
const esbuild = require('esbuild');

const DIST_DIR = './dist';
const OUTPUT_NAME = 'draughts-reader.core.js';

function clean(done) {
    fs.rm(DIST_DIR, { recursive: true, force: true }, done);
}

function build() {
    return esbuild.build({
        entryPoints: ['./src/main.js'],
        outfile: `${DIST_DIR}/${OUTPUT_NAME}`,
        bundle: true,
        format: 'iife',
        globalName: 'DraughtsReaderCore',
    });
}

exports.clean = clean;
exports.build = build;
exports.default = gulp.series(clean, build);
