const browserApi = globalThis.browser || globalThis.chrome;

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

