const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

const cssFiles = ['./node_modules/normalize.css/normalize.css', './src/css/**/*.css'];
const jsFiles = ['./src/js/1.js'];

function styles() {
  return gulp
    .src(cssFiles)
    .pipe(concat('main.css'))
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(jsFiles)
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(
      uglify({
        toplevel: true
      })
    )
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: './'
  });
  gulp.watch('./src/css/**/*.css', styles);
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./*.html', browserSync.reload);
}

function clean() {
  return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('clean', clean);

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'scripts')));
gulp.task('dev', gulp.series('build', 'watch'));
