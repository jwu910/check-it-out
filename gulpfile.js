const babel = require('gulp-babel');
const chalk = require('chalk');
const gulp = require('gulp');

const build = gulp.task('build', () => {
  return gulp
    .src('src/**/*.js')
    .pipe(babel())
    .on('error', error => {
      process.stderr.write(chalk.red.bold('Build failed.') + '\n');
      process.stderr.write(error.fileName + '\n');
      process.stderr.write(error.stack + '\n');

      this.emit('end');
    })
    .pipe(gulp.dest('dist'));
});

const watch = gulp.task('watch', () => {
  gulp.watch(['src/**/*.js'], gulp.task('build'));
});

exports.build = build;
exports.watch = watch;
