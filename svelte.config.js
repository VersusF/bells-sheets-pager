import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";

const dev = process.argv.includes("dev");

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // To use in GitHub page
        paths: {
            base: dev ? "" : "/bells-sheets-pager",
        },
        // If you are not using a .nojekyll file, change your appDir to something not starting with an underscore.
        // For example, instead of '_app', use 'app_', 'internal', etc.
        appDir: "internal",
        adapter: adapter({
            // default options are shown. On some platforms
            // these options are set automatically — see below
            pages: "build",
            assets: "build",
            fallback: null,
            precompress: false,
            strict: true,
        }),
    },
};

export default config;
