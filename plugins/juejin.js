module.exports = function(steward) {
    const version = 1;
    const author = 'clearives';
    const name = 'Juejin';
    const key = 'jj';
    const type = 'keyword';
    const icon = 'https://i.loli.net/2019/01/09/5c35880f1b8be.png';
    const title = '掘金文章搜索(0:推荐，1:前端，2:后端)';
    const subtitle = '按 Enter / Return 跳转到对应网页';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon
    }];

    function searchByType(type) {
        let url = 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_rank?src=web&limit=50&category=all'
        switch (type) {
            case '0':
                url = 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_rank?src=web&limit=50&category=all'
                break;
            case '1':
                url = 'https://timeline-merger-ms.juejin.im//v1/get_entry_by_rank?src=web&limit=50&category=5562b415e4b00c57d9b94ac8'
                break;
            case '2':
                url = 'https://timeline-merger-ms.juejin.im//v1/get_entry_by_rank?src=web&limit=50&category=5562b419e4b00c57d9b94ae2'
                break;
            default:
        }
        return steward.axios.get(url);
    }

    function dataFormat(list) {
        return list.map(item => {
            return {
                key: 'url',
                universal: true,
                icon: item.pic || icon,
                title: item.title,
                desc: '点赞数' + item.collectionCount + '评论数' + item.commentsCount + '作者: ' + item.user.username,
                url: item.originalUrl
            };
        });
    }

    function onInput(query, command) {
        if (query) {
            return searchByType(query).then(results => {
                const resp = results.data.d.entrylist;

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