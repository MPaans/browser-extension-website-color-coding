import { shared } from "./shared.js";

const browserApi = globalThis.browser || globalThis.chrome;

function ensureConfig() {
    browserApi.storage.sync.get("config", (data) => {
        if (data.config) {
            return;
        }

        console.log('Site color coding extension config not set, loading default config');
        browserApi.storage.sync.set({
            config: shared()
        });
    });
}

ensureConfig();

browserApi.runtime.onInstalled.addListener(ensureConfig);

