var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var config = require('../config');
var fs = require('fs');
var gulp = require('gulp');
var md5File = require('md5-file');
var modifyCssUrls = require('gulp-modify-css-urls');
var path = require('path');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

/**
 * Adds an md5 fingerprint to URLs that start with /source/.
 */
var _addFingerprint = function(url) {
  if (config.FINGERPRINT_ENABLED && url.startsWith(config.FINGERPRINT_PREFIX)) {
    var relPath = url.slice(config.FINGERPRINT_PREFIX.length);
    var localPath = path.join(config.FINGERPRINT_SOURCE_DIR, relPath);

    if (fs.existsSync(localPath)) {
      var fingerprint = md5File.sync(localPath);
      var placeholders = {
        'base': path.basename(relPath, path.extname(relPath)),
        'dir': path.dirname(relPath),
        'ext': path.extname(relPath),
        'fingerprint': fingerprint
      }
      var fingerprintedUrl =
          _formatPlaceholders(config.FINGERPRINT_FORMAT, placeholders);
      // console.log(url + ' => ' + fingerprintedUrl);
      return fingerprintedUrl;
    }

    console.log('WARNING: /' + localPath + ' does not exist');
  }
  return url;
};

/**
 * Simple string formatter for placeholders like "{var}".
 */
function _formatPlaceholders(format, placeholders) {
  return format.replace(/{[^{}]+}/g, function(key){
    return placeholders[key.replace(/[{}]+/g, '')] || '';
  });
}

gulp.task('sass', function() {
  gulp.src(config.SASS_SOURCE)
  .pipe(sass(config.SASS_OPTIONS)).on('error', sass.logError)
  .pipe(modifyCssUrls({
    modify: _addFingerprint
  }))
  .pipe(autoprefixer({}))
  .pipe(cleanCss())
  .pipe(rename(function(path) {
    path.basename += '.min';
  }))
  .pipe(gulp.dest(config.SASS_OUT_DIR));
});
