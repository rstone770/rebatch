const browserify = require('browserify'),
      babelify = require('babelify'),
      buffer = require('vinyl-buffer'),
      rename = require('gulp-rename'),
      source = require('vinyl-source-stream'),
      uglify = require('gulp-uglify');

/**
 * UMD module name.
 *
 * @type {string}
 */
const MODULE_NAME = 'rebatch';

/**
 * Output bundle name.
 *
 * @type {string}
 */
const BUNDLE_NAME = 'rebatch.js';

/**
 * Output minified bundle name.
 *
 * @type {string}
 */
const BUNDLE_MIN_NAME = 'rebatch.min.js';

/**
 * Bundle output path.
 *
 * @type {string}
 */
const BUNDLE_PATH = './dist';

/**
 * Main entry point.
 *
 * @type {string}
 */
const MAIN_ENTRY_NAME = './src/index.js';

/**
 * Creates a bundle stream from an entry file.
 *
 * @param {string} entry
 * @param {string} name
 * @returns {Stream}
 */
const bundle = (entry, name) => {
  return browserify(entry, { standalone: name })
    .transform(babelify)
    .bundle();
};

/**
 * Creates and registers a bundle task.
 *
 * @param {gulp} gulp
 */
module.exports = (gulp) => {
  const write = () => gulp.dest(BUNDLE_PATH);

  gulp.task('bundle', () => {
    return bundle(MAIN_ENTRY_NAME, MODULE_NAME)
      .pipe(source(BUNDLE_NAME))
      .pipe(buffer())
      .pipe(write())
      .pipe(uglify())
      .pipe(rename(BUNDLE_MIN_NAME))
      .pipe(write());
  });
};
