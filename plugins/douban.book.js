
module.exports = function (steward) {
    const version = 2;
    const author = 'solobat';
    const name = 'douban book';
    const key = 'dbb';
    const type = 'keyword';
    const icon = 'https://www.douban.com/favicon.ico';
    const title = '在 book.douban.com 查找书籍';
    const subtitle = '按 Enter / Return 跳转到豆瓣读书网页';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon,
        shiftKey: true
    }];

    function searchKeyword(keyword) {
        return steward.axios.get('https://book.douban.com/j/subject_suggest', {
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
                title: item.title,
                desc: `${item.year} ${item.author_name}`,
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
