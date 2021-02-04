const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminGuetzli = require('imagemin-guetzli');
const pixels = require('image-pixels');
const butteraugli = require('butteraugli');
const log = require('fancy-log');
const argv = require('yargs').argv;

const imageName = argv.image;
const quality = argv.quality;

const score = async function () {
    const [pixels1, pixels2] = await pixels.all([`src/${imageName}`, `${this.dist}/${imageName}`])
    const input1 = { data: pixels1.data, width: pixels1.width, height: pixels1.height }
    const input2 = { data: pixels2.data, width: pixels2.width, height: pixels2.height }
    const score = butteraugli(input1, input2, []);
    log('Butteraugli score: ', score);
}

gulp.task('mozjpeg', () => {
    const dist = `dist/mozjpeg/${quality}`;
    return gulp.src(`src/${imageName}`)
        .pipe(imagemin([imagemin.mozjpeg({ quality })]))
        .pipe(gulp.dest(dist))
        .on('end', score.bind({ dist }))
});

gulp.task('guetzli', () => {
    const dist = `dist/guetzli/${quality}`;
    return gulp.src(`src/${imageName}`)
        .pipe(imagemin([imageminGuetzli({ quality })]))
        .pipe(gulp.dest(dist))
        .on('end', score.bind({ dist }))
});