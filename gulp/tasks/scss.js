import * as sass from "sass";
import gulpSass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";

const gulpSassInstance = gulpSass(sass);

export const scss = () => {
    return app.gulp
        .src(app.path.src.scss, { sourcemaps: true })
        .pipe(
            app.plugins.plumber({
                errorHandler: (err) => {
                    console.error("Error!", err.message);
                    this.emit("end");
                },
            })
        )
        .pipe(sourcemaps.init())
        .pipe(
            gulpSassInstance({
                outputStyle: "expanded",
            })
        )
        .pipe(
            autoprefixer({
                grid: true,
                overrideBrowsersList: ["last 3 versions"],
                cascade: true,
            })
        )
        .pipe(sourcemaps.write("."))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browsersync.stream());
};
