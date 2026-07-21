const browserApi = globalThis.browser || globalThis.chrome;

browserApi.storage.sync.get('config', function(data) {
    config = data['config'];

    var envSelect = document.getElementById('addsiteto');
    var colorbarOption = document.getElementById('colorbar');
    var messageOption = document.getElementById('message');
    var domainChangeOption = document.getElementById('warning');
    var optionsButton = document.getElementById('options');

    envSelect.addEventListener('change', addSite);
    colorbarOption.addEventListener('click', setColorBarOption);
    messageOption.addEventListener('click', setMessageOption);
    domainChangeOption.addEventListener('click', setWarningOption);
    optionsButton.addEventListener('click', openOptionsPage);

    browserApi.storage.local.get('hostname', buildOptions);

    if (config.showColorBar) {
        colorbarOption.setAttribute('checked', true);
    }
    if (config.showMessage) {
        messageOption.setAttribute('checked', true);
    }
    if (config.domainChangeWarning) {
        domainChangeOption.setAttribute('checked', true);
    }
});

function addSite(event) {
    var env = event.srcElement.value;
    browserApi.storage.local.get('hostname', function(data){
        var hostname = data['hostname'];
        clearSites(hostname);
        if (env !== 'default') {
            config.sites[env].push(hostname);
        }
        browserApi.storage.sync.set({config: config}, function() {
            refreshMain();
        });
    });
}

function buildOptions(data) {
    var hostname = data.hostname;
    var select = document.getElementById('addsiteto');
    var optionSelected = false;

    var optionDefault = document.createElement('option');
    optionDefault.value = 'default';
    optionDefault.innerText = 'Default (regex matching)';
    select.appendChild(optionDefault);

    var optionNone = document.createElement('option');
    optionNone.value = 'none';
    optionNone.innerText = '<none>';
    select.appendChild(optionNone);
    if (optionSelected === false) {
        if (config.sites['none'].indexOf(hostname) !== -1) {
            optionNone.selected = true;
            optionSelected = true;
        }
    }

    for (var index in config.colorOrder) {
        var env = config.colorOrder[index];
        var sites = config.sites[env];
        var colorSettings = config.colorSettings[env];

        var option = document.createElement('option');
        option.value = env;
        option.style.backgroundColor = colorSettings.color;
        option.innerText = colorSettings.message;

        if (optionSelected === false) {
            if (sites.indexOf(hostname) !== -1) {
                option.selected = true;
                optionSelected = true;
            }
        }

        select.appendChild(option);
    }
}

function clearSites(hostname) {
    // Prevent reference by cloning object.
    var environments = Object.create(config.colorOrder);
    environments.unshift('none');
    environments.forEach(function (env) {
        var index = config.sites[env].indexOf(hostname);
        if (index === -1) {
            return;
        }
        config.sites[env].splice(index, 1);
    });
}

function setColorBarOption(event) {
    config.showColorBar = event.srcElement.checked;
    browserApi.storage.sync.set({config: config}, function() {
        refreshMain();
    });
}

function setMessageOption(event) {
    config.showMessage = event.srcElement.checked;
    browserApi.storage.sync.set({config: config}, function() {
        refreshMain();
    });
}

function setWarningOption(event) {
    config.domainChangeWarning = event.srcElement.checked;
    browserApi.storage.sync.set({config: config}, function() {
        refreshMain();
    });
}

function refreshMain() {
    browserApi.tabs.query({active: true, currentWindow: true}, function(tabs) {
        browserApi.tabs.sendMessage(tabs[0].id, {action: 'refresh'});
    });
}

function openOptionsPage() {
    browserApi.tabs.create({
        'url': browserApi.runtime.getURL("options.html")
    });
}
