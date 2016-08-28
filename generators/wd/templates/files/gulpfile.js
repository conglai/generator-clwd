'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');

const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const isOnline = argv._[0] === 'online';

const srcFiles = ['pages/**/*.(js|ejs|less)'];

//清空build目录
const rimraf = require('rimraf');
gulp.task('clean', cb => {
  rimraf('./build', cb);
});

const webpackConfigFunc = require('./gulp/webpack');
const webpack = require('webpack');
function logWebpackStats(stats) {
  gutil.log(stats.toString({
    colors: true,
    chunks: false,
    children: false
  }));
  gutil.log('------------- build over ---------------');
}

const fs = require('fs');
function getWebpackConfig(buildES3, isMobile) {
  let pagesPath = __dirname + '/pages';
  let files = fs.readdirSync(pagesPath);
  let entry = {};
  let indexName = isMobile ? 'index.m.js' : 'index.js';
  files.forEach(file => {
    let stat = fs.lstatSync(pagesPath + '/' + file);
    if(stat.isDirectory()) {
      try {
        let dstat = fs.lstatSync(`${pagesPath}/${file}/${indexName}`);
        if(dstat) {
          entry[file] = `${pagesPath}/${file}/${indexName}`;
        }
      } catch(e) {
        gutil.log(`${file} has no ${indexName}`);
      }
    }
  });
  let jsNameStr = '[name].js';
  let cssNameStr = '[name].css';
  if(buildES3) {
    jsNameStr = '[name].old.js';
    cssNameStr = '[name].old.css';
  }
  if(isMobile) {
    jsNameStr = '[name].m.js';
    cssNameStr = '[name].m.css';
  }
  return webpackConfigFunc(entry, 'build', jsNameStr, cssNameStr, isOnline, buildES3);
}

const eslintrc = require('./gulp/eslintrc');
const eslint = require('gulp-eslint');
gulp.task('lint', () => {
  return gulp.src(srcFiles)
    .pipe(eslint(eslintrc))
    .pipe(eslint.format());
});

gulp.task('build-web', () => {
  let config = getWebpackConfig(argv.old, argv.m);
  // gutil.log(config);
  webpack(config).watch({}, (err, stats) => {
    logWebpackStats(stats);
  });
});

gulp.task('devb', () => {
  let config = getWebpackConfig(argv.old, argv.m);
  // gutil.log(config);
  webpack(config).run((err, stats) => {
    logWebpackStats(stats);
  });
});

const path = require('path');
const livereload = require('gulp-livereload');
gulp.task('reload', () => {
  livereload.listen();
  let rootPath = path.normalize(__dirname + '/build');
  gulp.watch('build/*.css', e => {
    let file = e.path.replace(rootPath + '/', '');
    livereload.reload(file);
  });
});

gulp.task('watch', cb => {
  gulp.watch(srcFiles, file => {
    let src = file.path.replace(__dirname + '/', '');
    gutil.log(`file change:${src}`);
    gulp.src(src)
      .pipe(eslint(eslintrc))
      .pipe(eslint.format())
      .pipe(eslint.result(results => {
        if(!results.errorCount && !results.warningCount) {
          gutil.log(results.filePath + ' is ' + gutil.colors.green('ok'));
        }
      }));
  });
});

gulp.task('dev', ['lint', 'build-web', 'reload', 'watch']);

gulp.task('build', ['clean'], cb => {
  webpack(getWebpackConfig()).run((err, stats) => {
    logWebpackStats(stats);
    gutil.log('>>>>>>build normal type......');
    webpack(getWebpackConfig(false, true)).run((err, stats) => {
      logWebpackStats(stats);
      gutil.log('>>>>>>build mobile type......');
      webpack(getWebpackConfig(true)).run((err, stats) => {
        logWebpackStats(stats);
        gutil.log('>>>>>>build old type......');
        cb();
      });
    });
  });
});


const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const pump = require('pump');
const publishPath = __dirname + '/upload';


function publishJSCSS(done, dir, compress, force) {
  let jsEnd = false, cssEnd = false;
  let checkDone = () => {
    if(jsEnd && cssEnd) {
      // done();
      uploader.uploadDir(
        `${publishPath}/${dir}/${VERSION}`, `${dir}.${VERSION}.`,
        force
      ).then(() => {
        done();
      });
    }
  };
  let targetDir = `${publishPath}/${dir}/${VERSION}`;
  let jsStream, cssStream;
  if(compress) {
    jsStream = [
      gulp.src('build/*.js'),
      uglify(),
      gulp.dest(targetDir)
    ];
    cssStream = [
      gulp.src('build/*.css'),
      cssnano(),
      gulp.dest(targetDir)
    ];
  } else {
    jsStream = [
      gulp.src(['build/*.js', 'build/*.js.map']),
      gulp.dest(targetDir)
    ];
    cssStream = [
      gulp.src(['build/*.css', 'build/*.css.map']),
      gulp.dest(targetDir)
    ];
  }
  pump(jsStream,() => {
    jsEnd = true;
    checkDone();
  });
  pump(cssStream, () => {
    cssEnd = true;
    checkDone();
  });
}
gulp.task('online', ['build'], done => {
  publishJSCSS(done, 'online', true);
});

gulp.task('daily', ['build'], done => {
  publishJSCSS(done, 'daily', false, true);
});

const concat = require('gulp-concat');
gulp.task('lib', () => {
  return uploader.uploadDir(`${__dirname}/upload/lib`, 'lib.');
});

