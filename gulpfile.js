var babel = require('gulp-babel');
var chalk = require('chalk');
var gulp = require('gulp');

gulp.task('build', function() {
  return gulp
    .src('src/**/*.js')
    .pipe(babel())
    .on('error', function (error) {
      console.log(chalk.red.bold('Build failed.'));
      console.log(error.fileName);
      console.log(error.stack);

      this.emit('end');
    })
    .pipe(gulp.dest('lib'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['build']);
})