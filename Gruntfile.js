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
        uglify: {
            prod: {
                files: [
                    {
                        expand: true,
                        debugInfo: true,
                        cwd: './web/scripts',
                        src: ['*.js'],
                        dest: './web/scripts'
                    }
                ]
            }
        },
        includes: {
            build: {
                cwd: './dev/templates',
                src: ['*.html'],
                dest: 'web/',
                options: {
                    flatten: true,
                    includePath: './dev/templates/include'
                }
            }
        },
        replace: {
            development: {
                src: ['web/*.html'],
                overwrite: true,
                replacements: [{
                    from: 'GOOGLE_PUBLIC_RE_CAPTCHA_KEY',                   // string replacement
                    to: '6LcCd_0SAAAAAF4G-NtFdO05KHnhF67IOeCJACOb'
                }]
            },
            production: {
                src: ['web/*.html'],
                overwrite: true,
                replacements: [{
                    from: 'GOOGLE_PUBLIC_RE_CAPTCHA_KEY',                   // string replacement
                    to: '6LfAhv0SAAAAAOQsDRawFRx7QlYancR1mdjhM98a'
                }]
            }
        },
        copy: {
            images: {
                expand: true,
                cwd: './dev/templates/images/',
                src: '**/*',
                dest: './web/images/',
                mode: true
            },
            scripts: {
                expand: true,
                cwd: './dev/scripts/',
                src: '**/*',
                dest: './web/scripts/',
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');

    // Default task.
    grunt.registerTask('default', ['sass:dev']);
    grunt.registerTask('watchall', ['watch:styles', 'watch:templates']);
    grunt.registerTask('prod', ['sass:prod', 'includes:build', 'replace:production', 'copy:images', 'copy:scripts', 'uglify:prod']);
    grunt.registerTask('dev', ['sass:dev', 'includes:build', 'replace:development', 'copy:images', 'copy:scripts']);

      // Heroku task
    grunt.registerTask("heroku:development", ["dev"]);
    grunt.registerTask("heroku:production", ["prod"]);

};
