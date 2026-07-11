importScripts("shared.js");

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("config", (data) => {
        if (data.config) {
            return;
        }

        console.log('Site color coding extension config not set, loading default config');
        chrome.storage.sync.set({
            config: shared()
        });
    });
});

