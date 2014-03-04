module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '',
        watch: {
            styles: {
                files: './dev/sass/**.*',
                tasks: ['sass:dev'],
                options: {
                    interrupt: true
                }
            },
            templates: {
                files: './dev/templates/**.*',
                tasks: ['includes:build'],
                options: {
                    interrupt: true
                }
            }
        },
        sass: {
            dev: {
                options: {
                    trace: true,
                    noCache: true,
                    style: 'nested'
                },
                files: [
                    {
                        expand: true,
                        debugInfo: true,
                        cwd: './dev/sass',
                        src: ['*.scss'],
                        dest: './web/css',
                        ext: '.css'
                    }
                ]
            },
            prod: {
                options: {
                    style: 'compressed',
                    noCache: true
                },
                files: [
                    {
                        expand: true,
                        cwd: './dev/sass',
                        src: ['*.scss'],
                        dest: './web/css',
                        ext: '.css'
                    }
                ]
            }
        },
        includes: {
            build: {
                cwd: './dev/templates',
                src: [ '*.html'],
                dest: 'web/',
                options: {
                    flatten: true,
                    includePath: './dev/templates/include'
                }
            }
        },
        copy: {
            images: {
                expand: true,
                cwd: './dev/templates/images/',
                src: '**/*',
                dest: './web/images/',
                mode: true
            }
        },
        clean: ['./web/css/**.*', './web/*.html', './web/images/**/*']
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task.
    grunt.registerTask('default', ['sass:dev']);
    grunt.registerTask('watchall', ['watch:styles', 'watch:templates']);
    grunt.registerTask('prod', ['sass:prod', 'includes:build', 'copy:images']);
    grunt.registerTask('dev', ['sass:dev', 'includes:build', 'copy:images']);

};
