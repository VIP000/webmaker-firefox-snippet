const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const rename = require('gulp-rename');
const minifyCSS = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const handlebars = require('gulp-compile-handlebars');
const shell = require('gulp-shell');
const rimraf = require('rimraf');

const f = require('util').format;
const readfile = fs.readFileSync.bind(fs);
const join = path.join.bind(path, __dirname);

const JQUERY_VERSION = '2.1.1';
const JQUERY_REPO = 'git@github.com:jquery/jquery.git';

gulp.task('default', ['bundle']);

gulp.task('css', function() {
  return gulp.src('./src/*.css')
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('snippet-js', function () {
  return gulp.src(['./src/css-colors.js', './src/snippet.js'])
    .pipe(concat('snippet-bundle.js'))
    .pipe(uglify({mangle: { reserved: 'Snippet'}}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('js', ['jquery', 'snippet-js'], function () {
  return gulp.src([
    './dist/jquery.custom.min.js',
    './src/typeahead.jquery.min.js',
    './dist/snippet-bundle.js',
  ]).pipe(concat('bundle.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('bundle', ['css', 'js'], function () {
  const style = readfile(join('dist', 'snippet.min.css'));
  const script = readfile(join('dist', 'bundle.js'));
  const icon = 'data:image/png;base64,' +
    readfile(join('src', 'webmaker-logo.png')).toString('base64');

  const templateData = {script: script, style: style, icon: icon};

  return gulp.src('./src/snippet.template')
    .pipe(handlebars(templateData))
    .pipe(rename('snippet.html'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('test', ['bundle'], function () {
  const templateData = {snippet: readfile(join('dist', 'snippet.html'))};
  return gulp.src('./src/index.template')
    .pipe(handlebars(templateData))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./test/'));
});

gulp.task('clean', function (callback) {
  rimraf('./dist/*', callback);
});

gulp.task('deep-clean', ['clean'], function (callback) {
  rimraf('./jquery', callback);
});

gulp.task('watch', function () {
  gulp.watch('./src/*', ['test']);
});

gulp.task('fetch-jquery', function () {
  if (!fs.existsSync(join('jquery'))) {
    return shell.task([
      f('git clone -b %s --single-branch --depth=1 %s', JQUERY_VERSION, JQUERY_REPO),
    ])();
  }
});

gulp.task('build-jquery', ['fetch-jquery'], function () {
  const buildOptionsFile = join('src', 'jquery-build-options.json');
  const buildOutput = join('dist', 'jquery.custom.min.js');

  if (!fs.existsSync(buildOutput)) {
    return build();
  }

  const inputStat = fs.statSync(buildOptionsFile);
  const outputStat = fs.statSync(buildOutput);

  if (inputStat.mtime >= outputStat.mtime) {
    return build();
  }

  function build() {
    const buildOptions = require('./src/jquery-build-options');
    return gulp.src('./src/jquery-build-options.json')
      .pipe(shell([
        f('npm install'),
        f('./node_modules/.bin/grunt custom:%s', buildOptions.join(','))
      ], {
        cwd: join('jquery')
      }));
  }
});

gulp.task('jquery', ['build-jquery'], function () {
  return fs.createReadStream(join('jquery', 'dist', 'jquery.min.js'))
    .pipe(fs.createWriteStream(join('dist', 'jquery.custom.min.js')));
});
