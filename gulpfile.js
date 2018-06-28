var babel = require('gulp-babel');
var chalk = require('chalk');
var gulp = require('gulp');

gulp.task('build', function() {
  return gulp
    .src('src/**/*.js')
    .pipe(babel())
    .on('error', function(error) {
      process.stderr.write(chalk.red.bold('Build failed.') + '\n');
      process.stderr.write(error.fileName + '\n');
      process.stderr.write(error.stack + '\n');

      this.emit('end');
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['build']);
});
