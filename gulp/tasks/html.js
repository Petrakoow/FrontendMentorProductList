export const html = () => {
    return app.gulp
        .src(app.path.src.html)
        .pipe(
            app.plugins.plumber({
                errorHandler: function (err) {
                    console.error("Error!", err.message);
                    this.emit("end");
                },
            })
        )
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browsersync.stream());
};
