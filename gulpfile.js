var gulp = require('gulp');
var merge = require('./index.js');

gulp.task('merge',function(){
  return gulp.src('./test/**/*.html')
          .pipe(merge())
          .pipe(gulp.dest('./test1/'));
});


