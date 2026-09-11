const fs = require('fs');
const gulp = require('gulp');
const esbuild = require('esbuild');

const DIST_DIR = './dist';
const OUTPUT_NAME = 'draughts-reader.core.js';
const MINIFIED_OUTPUT_NAME = 'draughts-reader.core.min.js';

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

function minify() {
    return esbuild.build({
        entryPoints: ['./src/main.js'],
        outfile: `${DIST_DIR}/${MINIFIED_OUTPUT_NAME}`,
        bundle: true,
        format: 'iife',
        globalName: 'DraughtsReaderCore',
        minify: true,
    });
}

exports.clean = clean;
exports.build = build;
exports.minify = minify;
exports.default = gulp.series(clean, gulp.parallel(build, minify));
