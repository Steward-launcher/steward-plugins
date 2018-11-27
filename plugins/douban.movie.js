
module.exports = function (steward) {
    const version = 2;
    const author = 'solobat';
    const name = 'douban movie';
    const key = 'dbm';
    const type = 'keyword';
    const icon = 'https://www.douban.com/favicon.ico';
    const title = '在 movie.douban.com 查找电影';
    const subtitle = '按 Enter / Return 跳转到豆瓣电影网页';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon,
        shiftKey: true
    }];

    function searchKeyword(keyword) {
        return steward.axios.get('https://movie.douban.com/j/subject_suggest', {
            params: {
                q: keyword
            }
        });
    }

    function dataFormat(list) {
        return list.map(item => {
            const url = `http://movie.douban.com/subject/${item.id}?from=chrome_steward`;

            return {
                key: 'url',
                universal: true,
                icon: item.img || icon,
                title: item.title,
                desc: `${item.year} ${item.sub_title}`,
                url
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
