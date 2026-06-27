const {series, parallel, watch, src, dest} = require("gulp");
const livereload = require("gulp-livereload");
const postcss = require("gulp-postcss");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const plumber = require("gulp-plumber");
const newer = require("gulp-newer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Path configurations
const paths = {
  css: {
    src: ["assets/css/libs/*.css", "assets/css/screen.css"],
    dest: "assets/built/",
  },
  js: {
    src: ["assets/js/libs/*.js", "assets/js/*.js"],
    dest: "assets/built/",
  },
  templates: {
    src: ["*.hbs", "partials/**/*.hbs"],
  },
};

// Error handling
function handleError(err) {
  console.error(err.toString());
  this.emit("end");
}

// Optional livereload server
function serve(cb) {
  livereload.listen();
  cb();
}

// Template processing
function hbs() {
  return src(paths.templates.src).pipe(plumber(handleError)).pipe(livereload());
}

// CSS processing - FIXED VERSION
function css() {
  const plugins = [
    require("@tailwindcss/postcss"), // Process Tailwind FIRST
    autoprefixer(), 
    cssnano({preset: "default"})
  ];

  return src(paths.css.src)
    .pipe(plumber(handleError))
    .pipe(concat("screen.css")) // Concatenate FIRST
    .pipe(postcss(plugins)) // Then process with Tailwind
    .pipe(dest(paths.css.dest))
    .pipe(livereload());
}

// JavaScript processing
function js() {
  return src(paths.js.src)
    .pipe(plumber(handleError))
    .pipe(newer(paths.js.dest + "main.js"))
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(dest(paths.js.dest))
    .pipe(livereload());
}

// Watch files for changes
function watchFiles() {
  watch(paths.templates.src, hbs);
  watch([...paths.css.src, ...paths.templates.src], css);
  watch(paths.js.src, js);
}

// Task compositions
const build = series(parallel(css, js));

// Production task
function prod(cb) {
  const pkg = require("./package.json");
  const zipName = `${pkg.name}.zip`;
  const productionDir = path.join(__dirname, "production");
  const zipPath = path.join(productionDir, zipName);

  // Ensure production folder exists
  if (!fs.existsSync(productionDir)) {
    fs.mkdirSync(productionDir);
  }

  // Delete old zip if it exists
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
    console.log(`Deleted old ${zipName}`);
  }

  // Run build first
  build(() => {
    // Use find -type f to guarantee no symlinks are included in the zip
    const cmd = `cd "${__dirname}" && find . -type f ` +
      `-not -path "*/node_modules/*" ` +
      `-not -path "*/.git/*" ` +
      `-not -path "*/production/*" ` +
      `-not -name "Archive.zip" ` +
      `-not -name ".DS_Store" ` +
      `| zip -X "${zipPath}" -@`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        cb(err);
      } else {
        console.log(stdout);
        console.log(`Created ${zipPath}`);
        cb();
      }
    });
  });
}

// Export tasks
module.exports = {
  serve,
  css,
  js,
  hbs,
  build,
  watch: watchFiles,
  default: series(build, serve, watchFiles),
  prod,
};