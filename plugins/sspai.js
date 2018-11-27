
module.exports = function (steward) {
    const version = 3;
    const author = 'solobat';
    const name = 'sspai articles';
    const key = 'ssp';
    const type = 'keyword';
    const icon = 'https://cdn.sspai.com/sspai/assets/img/favicon/icon.ico';
    const title = '少数派首页文章';
    const subtitle = '按 Enter / Return 跳转到少数派网页';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon,
        shiftKey: true
    }];

    function fetchList() {
        return steward.axios.get('https://sspai.com/api/v1/articles', {
            params: {
                offset: 0,
                limit: 20,
                type: 'recommend_to_home',
                sort: 'recommend_to_home_at',
                include_total: false
            }
        });
    }

    function dataFormat(list) {
        return list.map(item => {
            const url = `https://sspai.com/post/${item.id}`;

            return {
                key: 'url',
                universal: true,
                icon: `https://cdn.sspai.com/${item.author.avatar}`,
                title: item.promote_intro,
                desc: item.summary || url,
                url
            };
        });
    }

    function onInput(query, command) {
        return fetchList().then(results => {
            const resp = results.data;

            if (resp.list && resp.list.length) {
                return dataFormat(resp.list);
            } else {
                return steward.util.getDefaultResult(command);
            }
        }).catch(() => {
            return steward.util.getDefaultResult(command);
        });
    }

    function onEnter(item, command, query, shiftKey, list) {

    }

    return {
        author,
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
