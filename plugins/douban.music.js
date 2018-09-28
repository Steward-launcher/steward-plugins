
module.exports = function (steward) {
    const version = 1;
    const author = 'lifesign';
    const name = 'douban music';
    const key = 'dbmc';
    const type = 'keyword';
    const icon = 'https://www.douban.com/favicon.ico';
    const title = '在 music.douban.com 查找音乐';
    const subtitle = '按 Enter / Return 跳转到豆瓣音乐网页';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon
    }];

    function searchKeyword(keyword) {
        return steward.axios.get('https://music.douban.com/j/subject_suggest', {
            params: {
                q: keyword
            }
        });
    }

    function dataFormat(list) {
        return list.map(item => {
            return {
                key: 'url',
                universal: true,
                icon: item.pic || icon,
                title: item.title + (item.other_title ? ' 其他名称: ' + item.other_title : ''),
                desc: item.performer ? '表演者: ' + item.performer : '(音乐人)',
                url: item.url
            };
        });
    }

    function onInput(query, command) {
        if (query) {
            return searchKeyword(query).then(results => {
                const resp = results.data;

                if (resp && resp.length) {
                    return dataFormat(resp);
                } else {
                    return steward.util.getDefaultResult(command);
                }
            }).catch(() => {
                return steward.util.getDefaultResult(command);
            });
        } else {
            return steward.util.getDefaultResult(command);
        }
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
