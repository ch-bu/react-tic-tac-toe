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
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import del from 'del';
import runSequence from 'run-sequence';

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
  .pipe(rename('styles.min.css'))
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
    .pipe(gulp.dest('dist'));
});

/**
 * Copy all concatenated files to dist directory
 */
gulp.task('copy-concat-files', () => {
  gulp.src(['.tmp/**/*'])
    .pipe(gulp.dest('dist'));
});

/**
 * Babel service worker
 */
gulp.task('babel-sw', () => {
  gulp.src('app/service-worker.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(rename('sw.js'))
    .pipe(gulp.dest(('.tmp/')));
});

// Watch files for changes
gulp.task('serve', ['clean', 'webpack', 'styles', 'babel-sw'], () => {
  browserSync({
      notify: false,
      port: 3000,
      server: {
          baseDir: ['app', '.tmp']
      }
  });

  gulp.watch(['app/service-worker.js'], ['babel-sw', reload]);
  gulp.watch(['app/styles/*.scss'], ['styles', reload]);
  gulp.watch(['app/*.html'], reload);
  gulp.watch(['app/scripts/**/*'], ['webpack', reload]);
});


/**
 * Clean output directory
 */
gulp.task('clean', () => del(['.tmp', 'dist'], {dot: true}));


/**
 * Build app for production
 */
gulp.task('default', ['clean', 'webpack', 'styles', 'babel-sw', 'html'], (cb) => {
  runSequence(
    ['copy-concat-files'],
    cb
  )
});
