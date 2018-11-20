
module.exports = function (steward) {
    const util = steward.util;
    const version = 1;
    const name = 'firefox';
    const type = 'search';
    const icon = chrome.extension.getURL('iconfont/chrome.svg');
    const title = chrome.i18n.getMessage(`${name}_title`);
    const settingUrls = [];
    const firefoxUrls = settingUrls.concat(["about:about", "about:addons", "about:buildconfig", "about:cache", "about:checkerboard", "about:config", "about:crashes", "about:credits", "about:debugging", "about:devtools", "about:downloads", "about:home", "about:license", "about:logo", "about:memory", "about:mozilla", "about:networking", "about:newtab", "about:performance", "about:plugins", "about:policies", "about:preferences", "about:privatebrowsing", "about:profiles", "about:restartrequired", "about:reader", "about:rights", "about:robots", "about:serviceworkers", "about:studies", "about:sessionrestore", "about:support", "about:sync-log", "about:telemetry", "about:url-classifier", "about:webrtc", "about:welcome", "about:welcomeback"]);

    function onInput(text) {
        const filterByName = suggestions => util.getMatches(suggestions, text);
        const mapTo = key => item => {
            return {
                icon,
                key,
                title: item.split(':')[1].replace('/', ' '),
                desc: item,
                url: item
            }
        };

        const pages = filterByName(firefoxUrls).map(mapTo('url'));

        return Promise.resolve(pages);
    }

    function onEnter(item, command, query, keyStatus) {
        util.createTab(item, keyStatus);
    }

    return {
        author: 'solobat',
        version,
        name: 'Firefox',
        category: 'browser',
        type,
        icon,
        title,
        onInput,
        onEnter,
        canDisabled: false
    };
}