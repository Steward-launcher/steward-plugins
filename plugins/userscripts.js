
module.exports = function (steward) {
    const version = 1;
    const id = 'solobat';
    const name = 'User Scripts';
    const key = 'us';
    const type = 'keyword';
    const icon = 'https://greasyfork.org/assets/blacklogo96-e0c2c76180916332b7516ad47e1e206b42d131d36ff4afe98da3b1ba61fd5d6c.png';
    const title = '根据 host 查找 userscripts';
    const subtitle = '数据来自 https://greasyfork.org/';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon
    }];

    function getSiteData(host) {
        const lang = chrome.i18n.getUILanguage();

        return steward.axios.get(`https://greasyfork.org/${lang}/scripts/by-site/${host}.json`);
    }

    function dataFormat(list) {
        return list.map(item => {
            return {
                key: 'url',
                universal: true,
                icon: steward.app.data.page ? steward.app.data.page.icon : icon,
                title: item.name,
                desc: item.description,
                url: item.url
            };
        });
    }

    function onInput(query, command) {
        const hostReg = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
        let host = query.trim();

        if (!host && steward.app.data.page) {
            host = steward.app.data.page.host;
        }

        if (host.startsWith('www.')) {
            host = host.slice(4);
        }

        if (hostReg.test(host)) {
            return getSiteData(host).then(results => {
                if (results.data && results.data.length) {
                    return dataFormat(results.data);
                } else {
                    return steward.util.getEmptyResult(command);
                }
            });
        } else {
            return steward.util.getDefaultResult(command);
        }
    }

    function onEnter(item, command, query, shiftKey, list) {
        steward.util.copyToClipboard(item.title, true);
    }

    return {
        id,
        version,
        name,
        category: 'other',
        icon,
        title,
        commands,
        onInput,
        onEnter
    };
}
