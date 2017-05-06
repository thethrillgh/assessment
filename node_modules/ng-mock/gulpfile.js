var gulp = require('gulp');
var eslint = require('gulp-eslint');
var del = require('del');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('clean', function () {
  return del(['tmp', 'dist']);
});

gulp.task('lint', ['clean'], function () {
  var sources = [
    'src/**/*.js',
    'test/**/*.js'
  ];

  return gulp.src(sources)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('istambul-hook-require', ['lint'], function () {
  return gulp.src('src/**/*.js')
    .pipe(istanbul({ includeUntested: true }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['istambul-hook-require'], function () {
  return gulp.src('test/**/*.js')
    .pipe(mocha())
    .pipe(istanbul.writeReports({
      dir: 'tmp/coverage',
      reporters: ['lcov', 'text-summary'],
      reportOpts: { dir: 'tmp/coverage' }
    }))
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 80 } }));
});

gulp.task('scripts', ['test'], function () {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('build', [
  'scripts'
]);
