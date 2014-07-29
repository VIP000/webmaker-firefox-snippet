const fs = require('fs');
const mime = require('mime');
const path = require('path');
const gulp = require('gulp');
const rename = require('gulp-rename');
const minifyCSS = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const handlebars = require('gulp-compile-handlebars');
const clean = require('gulp-clean');

const f = require('util').format;
const readfile = fs.readFileSync.bind(fs);
const join = path.join.bind(path, __dirname);

const LOGO_PATH = 'maker-party.svg';
const LOGO_TYPE = mime.lookup(LOGO_PATH);

gulp.task('default', ['build']);

gulp.task('css', function() {
  return gulp.src('./src/*.css')
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/'));
});

gulp.task('js', function () {
  const templateData = {
    snippet: readfile(join('src', 'snippet.js')),
    typeahead: readfile(join('src', 'typeahead.jquery.js')),
  };

  return gulp.src('./src/script.template')
    .pipe(handlebars(templateData))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('minify-js', ['js'], function () {
  return gulp.src('./build/bundle.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/'));
});

gulp.task('build', ['css', 'minify-js'], function () {
  const style = readfile(join('build', 'snippet.min.css'));
  const script = readfile(join('build', 'bundle.min.js'));
  const icon = f('data:%s;base64,', LOGO_TYPE) +
    readfile(join('src', LOGO_PATH)).toString('base64');

  const templateData = {script: script, style: style, icon: icon};

  return gulp.src('./src/snippet.template')
    .pipe(handlebars(templateData))
    .pipe(rename('snippet.html'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('test', ['build'], function () {
  const templateData = {snippet: readfile(join('dist', 'snippet.html'))};
  return gulp.src('./src/index.template')
    .pipe(handlebars(templateData))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./'));
});

gulp.task('clean', function () {
  const folders = ['./dist/*', './build/*'];
  return gulp.src(folders, {read: false})
    .pipe(clean());
});

gulp.task('watch', function () {
  gulp.watch(['./src/*', './gulpfile.js'], ['test']);
});
