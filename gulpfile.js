const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const { deleteAsync } = require('del');

// Dossiers source et destination
const paths = {
  styles: {
    src: 'assets/css/**/*.css',
    dest: 'assets/dist/css/'
  },
  scripts: {
    src: 'assets/js/**/*.js',
    dest: 'assets/dist/js/'
  }
};

// Nettoyer les fichiers générés
function clean() {
  return deleteAsync([
    'assets/dist/**/*',
    '!_site/assets/dist/.gitkeep'
  ]);
}

// Tâche pour les styles
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(cleanCSS())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest(paths.styles.dest));
}

// Tâche pour les scripts
function scripts() {
  return gulp.src([
    'assets/js/main.js',
    'assets/js/carousel.js',
    'assets/js/contact.js',
    'assets/js/news-carousel.js'
  ], { sourcemaps: true, allowEmpty: true })
    .pipe(concat('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}

// Tâche pour surveiller les changements
function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
}

// Tâches
const build = gulp.series(clean, gulp.parallel(styles, scripts));

// Exporter les tâches
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;

// Tâche par défaut
exports.default = build;
