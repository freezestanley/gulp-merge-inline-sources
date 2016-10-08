var gulp = require('gulp');
var merge = require('./index.js');

gulp.task('merge',function(){
  return gulp.src('./test/**/*.html')
          .pipe(merge({In:'./test',jsMerge:true,sassMerge:true}))
          .pipe(gulp.dest('./test1/'));
});


