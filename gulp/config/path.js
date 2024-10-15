import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = "./dist";
const srcFolder = "./src";

export const path = {
    build: {
        css: `${buildFolder}/css/`,
        html: `${buildFolder}/`,
        app: `${buildFolder}/app/`,
        fonts: `${buildFolder}/assets/fonts/`,
        images: `${buildFolder}/assets/images/`,
    },
    src: {
        scss: `${srcFolder}/scss/main.scss`,
        html: `${srcFolder}/*.html`,
        app: `${srcFolder}/app/**/*.*`,
        fonts: `${srcFolder}/assets/fonts/**/*.*`,
        images: `${srcFolder}/assets/images/**/*.*`,
    },
    watch: {
        scss: `${srcFolder}/scss/**/*.scss`,
        html: `${srcFolder}/**/*.html`,
        app: `${srcFolder}/app/**/*.*`,
        fonts: `${srcFolder}/assets/fonts/**/*.*`,
        images: `${srcFolder}/assets/images/**/*.*`,
    },
    clean: buildFolder,
};
