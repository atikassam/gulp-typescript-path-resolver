const gulp = require('gulp');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('./tsconfig.json');

gulp.task('build', () => {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest(tsProject.config.compilerOptions.outDir))
});