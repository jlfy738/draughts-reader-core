module.exports = function(grunt){

    grunt.initConfig({
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['src/core/symbols.js', 'src/core/Square.js', 'src/core/RafleItem.js', 'src/core/NTree.js', 'src/core/Move.js', 'src/core/DraughtBoard.js', 'src/core/Diagonal.js', 'src/core/PathFinder.js', 'src/core/Arbiter.js', 'src/core/Game.js'],
                dest: 'dist/draughts-player.core.js',
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
}
