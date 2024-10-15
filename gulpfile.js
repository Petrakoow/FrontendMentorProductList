import gulp from "gulp";
import ghPages from "gh-pages";

import { path as pathGulp } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";

import path from "path";

global.app = {
    path: pathGulp,
    gulp: gulp,
    plugins: plugins,
};

import { reset } from "./gulp/tasks/reset.js";
import { copyAll } from "./gulp/tasks/copy.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";

const [copyApp, copyFonts, copyImages] = copyAll;

function watcher() {
    gulp.watch(pathGulp.watch.app, copyApp);
    gulp.watch(pathGulp.watch.fonts, copyFonts);
    gulp.watch(pathGulp.watch.images, copyImages);
    gulp.watch(pathGulp.watch.html, html);
    gulp.watch(pathGulp.watch.scss, scss);
}

const mainTasks = gulp.parallel(...copyAll, html, scss);

const serverAndWatcher = gulp.parallel(watcher, server);

const dev = gulp.series(reset, mainTasks, serverAndWatcher);

gulp.task("default", dev);

function deploy(cb) {
    ghPages.publish(path.join(process.cwd(), "dist"), cb);
}

gulp.task("deploy", gulp.series(reset, mainTasks, deploy));
