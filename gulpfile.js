// Gulp Dependencies
var gulp = require('gulp');
var rename = require('gulp-rename');

// Build Dependencies
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var stripDebug = require('gulp-strip-debug');
var Server = require('karma').Server;

// Development Dependencies
var eslint = require('gulp-eslint');
var jsdoc = require('gulp-jsdoc3');
var pump = require('pump');

gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint-test', function() {
  return gulp.src(['./test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('doc', function (cb) {
    var config = require('./jsdoc.json');
    gulp.src(['./src/**/*.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task('browserify', ['lint'], function() {
  var b = browserify({
      entries: './src/index.js',
      debug: true,
    }).transform(babelify.configure({
            presets: ["es2015"]
    }));
  return b.bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('build'))
});

gulp.task('test',['lint-test'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('uglify', ['browserify'], function() {
  return gulp.src('build/cltrack.js')
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(rename('index.min.js'))
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('default',  ['test','uglify','doc']);
