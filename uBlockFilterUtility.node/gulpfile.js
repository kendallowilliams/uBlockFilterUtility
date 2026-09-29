const gulp = require('gulp');
const { gulpEsbuild } = require('gulp-esbuild');
const minify = require('gulp-minify');

gulp.task('default', function() {
    return gulp.src('./app.ts')
        .pipe(gulpEsbuild({
            outfile: 'app.js',
            bundle: true,
            loader: { '.tsx': 'tsx'},
            entryPoints: ['./app.ts'],
            platform: 'node'
        }))
    .pipe(minify({
        ext: '.min.js'
    }))
    .pipe(gulp.dest('./dist'));
});