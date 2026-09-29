const gulp = require('gulp');
const { gulpEsbuild } = require('gulp-esbuild');

gulp.task('default', function() {
    return gulp.src('./app.ts')
        .pipe(gulpEsbuild({
            outfile: 'app.js',
            bundle: true,
            loader: { '.tsx': 'tsx'},
            entryPoints: ['./app.ts'],
            platform: 'node'
        }))
        .pipe(gulp.dest('./dist'));
});