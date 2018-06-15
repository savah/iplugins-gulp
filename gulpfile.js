var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');


const stylish = require('jshint-stylish');




gulp.task('browserSync', function () {
	browserSync({
		proxy: {
			target: 'https://www.ikea.com/xx/en/',
			proxyReq: [
				function(proxyReq) {
					proxyReq.setHeader('Access-Control-Allow-Origin', '*');
				}	
			]
		},
		notify: true,
		cors: true,
		files: ['desktop.css', 'desktop.js'],
		serveStatic: ['./'],
		snippetOptions: {
			rule: {
				match: /<\/head>/i,
				fn: function (snippet, match) {
					var css = '<link rel="stylesheet" href="/desktop.css" type="text/css"/>';
					var js = '<script type="text/javascript" src="/desktop.js"></script>';
					return js + css + snippet + match;
				},
			},
		}


	});
});

gulp.task('iplugins-scss', function () {
	return gulp.src('scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(concat('desktop.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('.'))
		.pipe(browserSync.stream());
});

gulp.task('iplugins-js', function () {
	return gulp.src('js/*.js')
		.pipe(sourcemaps.init())
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(concat('desktop.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('.'))
		.pipe(browserSync.stream());
});


gulp.task('watch', ['browserSync', 'iplugins-scss', 'iplugins-js'], function () {
	gulp.watch('./js/*.js', ['iplugins-js', 'bs-reload']);
	gulp.watch('./scss/*.scss', ['iplugins-scss']);
});

gulp.task('bs-reload', function (){
    browserSync.reload();
});

gulp.task('default', ['iplugins-js', 'iplugins-scss']);
