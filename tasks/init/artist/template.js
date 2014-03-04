/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var path = require('path'),
    fs = require('fs');

var superlatives = ['amazing', 'wonderful', 'killer', 'awesome', 'superb', 'fantastic'],
    which = ['String', 'Array', 'Object', 'People', 'Microwave', 'Pulse', 'Plasma'],
    what = ['Feature', 'Tool', 'Converter', 'Analyzer', 'Weapon', 'Destructor', 'Creator'],
    prompts = [
        {
            message: 'Short Name',
            name: 'shortName',
            default: function (value, data, done) {
                var name = superlatives[Math.floor(Math.random() * superlatives.length)];
                name += which[Math.floor(Math.random() * which.length)];
                name += what[Math.floor(Math.random() * what.length)];
                done(null, name);
            },
            validator: /^[\w\-]+$/,
            warning: 'Must be only letters, numbers, dashes.',
            sanitize: function (value, data, done) {
                done();
            }
        },
        {
            message: 'Artist Full Name',
            name: 'fullName',
            default: function (value, data, done) {
                done(null, "");
            },
            validator: /^.+$/,
            warning: 'Must be only letters, numbers, underscores or forward slashes',
            sanitize: function (value, data, done) {
                done();
            }
        }
    ];

// Basic template description.
exports.description = 'Creates artist pages (html, localizations)';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Any existing file or directory matching this wildcard will cause a warning.
//exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done) {

    init.process({type: 'grunt'}, prompts, function (err, props) {
        // Files to copy (and process).
        var files = init.filesToCopy(props);

        init.copyAndProcess(files, props);

        // All done!
        done();
    });
};