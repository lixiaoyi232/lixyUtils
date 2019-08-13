const gulp = require('gulp')
const gutil = require('gulp-util')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const nodemon = require('gulp-nodemon')
const fs = require('fs-extra')
const path = require('path')

const SRC = 'src'
const DIST = 'dist'

gulp.task('clean', function () {
  fs.emptyDirSync(DIST)
})

gulp.task('compile', ['clean'], function () {
  return gulp.src(SRC + '/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(ts.createProject('tsconfig.json')())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST))
})

gulp.task('watch', ['compile'], function () {
  let dirname = __dirname.replace(/\\/g, '/')
  gulp.watch(SRC + '/**/*.ts', function (event) {
    if (!event.path.endsWith('.ts')) {
      return
    }
    console.log('\n\n')
    if (event.type === 'deleted') {
      let p = event.path.replace(/\\/g,'/').replace(new RegExp('^' + dirname + '/' + SRC + '(.*).ts$'), dirname + '/' + DIST + '$1.js')
      gutil.log(gutil.colors.cyan('removing '), gutil.colors.magenta(p))
      fs.removeSync(p)
    } else {
      let p = event.path.replace(/\\/g,'/').replace(new RegExp('^' + dirname + '/' + SRC + '(.*).ts$'), dirname + '/' + DIST + '$1.js')
      gutil.log(gutil.colors.cyan('compiling '), gutil.colors.magenta(event.path))
      gulp.src(event.path)
        .pipe(sourcemaps.init())
        .pipe(ts.createProject('tsconfig.json')())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dirname(p)))
    }
  })
  return nodemon({
    script: DIST + '/app.js',
    watch: DIST,
    // tasks: ['compile'],
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    },
    // exec: 'node --inspect'
  })
})
