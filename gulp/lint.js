const lint = require('gulp-eslint');

/**
 * Linting paths.
 *
 * @type {string[]}
 */
const SOURCES = [
  '**/*.js',
  '!node_modules/**',
  '!dist/**'
];

/**
 * Creates and registers linting task.
 *
 * @param {gulp} gulp
 */
module.exports = (gulp) => {
  gulp.task('lint', () => {
    return gulp.src(SOURCES)
      .pipe(lint({}))
      .pipe(lint.format())
      .pipe(lint.failAfterError());
  });
};
