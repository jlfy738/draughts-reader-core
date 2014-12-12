module.exports = function(grunt){

    grunt.initConfig({
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['src/core/*.js'],
                dest: 'dist/draughts-player.core.js',
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
}
