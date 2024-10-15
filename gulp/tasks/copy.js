export const copyApp = () => {
    return app.gulp
        .src(app.path.src.app)
        .pipe(app.gulp.dest(app.path.build.app));
};

export const copyFonts = () => {
    return app.gulp
        .src(app.path.src.fonts, { encoding: false })
        .pipe(app.gulp.dest(app.path.build.fonts));
};

export const copyImages = () => {
    return app.gulp
        .src(app.path.src.images, { encoding: false }) 
        .pipe(
            app.plugins.plumber({
                errorHandler: (err) => {
                    console.error("Error!", err.message);
                    this.emit("end");
                },
            })
        )
        .pipe(app.gulp.dest(app.path.build.images)) 
        .on("end", () => {
            console.log("Images copied successfully");
        });
};

export const copyAll = [copyApp, copyFonts, copyImages];
