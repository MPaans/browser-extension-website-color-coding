const browserApi = globalThis.browser || globalThis.chrome;

if( 'function' === typeof importScripts) {
    importScripts('shared.js');
}

browserApi.runtime.onInstalled.addListener(() => {
    browserApi.storage.sync.get("config", (data) => {
        if (data.config) {
            return;
        }

        console.log('Site color coding extension config not set, loading default config');
        browserApi.storage.sync.set({
            config: shared()
        });
    });
});


function ensureConfig() {
    browserApi.storage.sync.get("config", ({ config }) => {
        if (!config) {
            chrome.storage.sync.set({
                config: shared()
            });
        }
    });
}

browserApi.runtime.onInstalled.addListener(ensureConfig);
ensureConfig();