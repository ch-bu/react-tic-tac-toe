// Libraries
import gulp from 'gulp';
import browserSync from 'browser-sync';
import webpack from 'webpack-stream';
import htmlmin from 'gulp-htmlmin';
import newer from 'gulp-newer';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import size from 'gulp-size';
import cssnano from 'gulp-cssnano';
import autoprefixer from 'gulp-autoprefixer';

// Constants
const reload = browserSync.reload;

// Bundle all javascript files
gulp.task('webpack', () => {
  return gulp.src('app/scripts/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('.tmp/scripts'));
});

/**
 * Compile and automatically prefix stylesheets
 */
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/styles/*.scss',
  ])
  .pipe(newer('.tmp/styles'))
  .pipe(sourcemaps.init())
  .pipe(sass({precision: 10}).on('error', sass.logError))
  .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
  // // Concatenate and minify styles
  .pipe(cssnano())
  .pipe(size({title: 'styles'}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('.tmp/styles'));
});

/**
 * Scan your HTML for assets & optimize them
 */
gulp.task('html', () => {
  return gulp.src('./app/*.html')
    // Minify any HTML
    .pipe(newer('.tmp'))
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      // removeOptionalTags: true
    }))
    .pipe(gulp.dest('.dist'));
});

// Watch files for changes
gulp.task('serve', ['webpack', 'styles'], () => {
  browserSync({
      notify: false,
      port: 3000,
      server: {
          baseDir: ['app', '.tmp']
      }
  });

  gulp.watch(['app/styles/*.scss'], ['styles', reload]);
  gulp.watch(['app/*.html'], reload);
  gulp.watch(['app/scripts/**/*'], ['webpack', reload]);
});
