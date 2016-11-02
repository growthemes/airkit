module.exports = {
  JS_SOURCES: [
    './source/js/main.js'
  ],
  JS_OUT_DIR: './dist/js/',
  JS_OUT_FILE: 'main.min.js',
  JS_OPTIONS: {
    uglify: {
      mangle: false
    }
  },
  SASS_SOURCE: ['./source/sass/*.sass', './source/sass/*.scss'],
  SASS_OUT_DIR: './dist/css/'
};
