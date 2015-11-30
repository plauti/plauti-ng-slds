module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        concat : {
            options: {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                
            },
            build : {
                src : ['src/<%= pkg.name %>.js', 'src/plauti-multi-select.js', 'src/plauti-pick-list.js', 'src/plauti-time-picker.js', 'src/plauti-date-picker.js', 'src/plauti-date-time-picker.js', 'src/plauti-typeahead.js'],
                dest : 'build/<%= pkg.name %>.js'
            }  
        },
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle : false,
                beautify : false,
                compress : {
                    drop_console : false,
                    sequences : false
                }
            },
            build : {
                src : ['src/<%= pkg.name %>.js', 'src/plauti-multi-select.js', 'src/plauti-pick-list.js', 'src/plauti-time-picker.js', 'src/plauti-date-picker.js', 'src/plauti-date-time-picker.js', 'src/plauti-typeahead.js'],
                dest : 'build/<%= pkg.name %>.min.js'
            }

        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'concat']);
    

}; 