/* jshint strict: false */
var browserify = require('browserify'),
    browserSync = require('browser-sync'),
    chalk = require('chalk'),
    gulpIf = require('gulp-if'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    strip = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    gulp = require('gulp');

// paths and file names
var src = './src',
    dist = './dist',
    jsSrc = src+'/js/',
    jsIndex = 'main.js',
    jsDist = dist+'/js/',
    jsBundle = 'bundle.js';

//log
function logError(msg) {
  console.log(chalk.bold.red('[ERROR] ' + msg.toString()));
}

// build bundled js using browserify
function buildJS(debug) {
  return browserify(jsSrc+jsIndex, {debug: debug})
    .bundle()
    .on('error', logError)
    .pipe(source(jsBundle))
    .pipe(gulpIf(!debug, streamify(strip())))
    .pipe(gulpIf(!debug, streamify(uglify())))
    .pipe(gulp.dest(jsDist))
    .pipe(browserSync.reload({ stream: true }));
}
gulp.task('js', function() {
  buildJS(true);
});
gulp.task('js-release', function() {
  buildJS(false);
});

// js hint - ignore libraries and bundled
gulp.task('jshint', function() {
  return gulp.src([
      './gulpfile.js',
      jsSrc+'/**/*.js',
      '!'+jsSrc+'/lib/**/*.js'
    ])
    .pipe(jshint({
      'node': true,
      'browser': true,
      'es5': false,
      'esnext': true,
      'bitwise': false,
      'camelcase': false,
      'curly': true,
      'eqeqeq': true,
      'immed': true,
      'latedef': true,
      'newcap': true,
      'noarg': true,
      'quotmark': 'single',
      'regexp': true,
      'undef': true,
      'unused': true,
      'strict': true,
      'trailing': true,

      'predef': [
          'Modernizr',
          'ga'
      ]
  }))
  .pipe(jshint.reporter('jshint-stylish'));
});

// connect with live reload
gulp.task('connect', function() {
  browserSync.init(null, {
    browser: 'google chrome',
    server: {
      baseDir: dist,
    }
  });
});

// watch
gulp.task('watch', function() {
  // gulp.watch(jsSrc+'**/*.js', ['jshint', 'js']);
  gulp.watch(jsSrc+'**/*.js', ['js']);
});

// default
gulp.task('default', ['connect', 'watch']);

