
module.exports = function (steward) {
    const version = 1;
    const author = 'solobat';
    const name = 'Coin News';
    const key = 'bi';
    const type = 'keyword';
    const icon = 'https://www.bishijie.com/favicon.ico';
    const title = '币世界新闻';
    const subtitle = '按 Enter / Return 跳转到币世界网页';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon
    }];

    const api = {
        list: 'https://www.bishijie.com/api/newsv17/index',
        search: 'https://www.bishijie.com/api/newsv17/search'
    };
    const newsBaseURL = 'https://www.bishijie.com/kuaixun_';

    function createRequest(query) {
        const request = {};

        if (query) {
            request.url = api.search; 
            request.params = {
                key: query,
                size: 50,
                from: 0
            };
            request.respHandle = resp => resp.data.express;
        } else {
            request.url = api.list;
            request.params = {
                size: 50,
                client: 'pc'
            };
            request.respHandle = resp => {
                return resp.data.reduce((list, day) => {
                    list = list.concat(day.buttom ? day.buttom : []);

                    return list;
                }, []);
            }
        }

        return request;
    }

    function fetchNews(query) {
        const request = createRequest(query);

        return steward.axios.get(request.url, {
            params: request.params
        }).then(({ data }) => {
            if (data.error === 0) {
                return request.respHandle(data);
            } else {
                return Promise.reject(null);
            }
        });
    }

    function dataFormat(list) {
        return list.map(item => {
            return {
                key: 'url',
                universal: true,
                icon,
                title: item.title,
                desc: item.content,
                url: `${newsBaseURL}${item.newsflash_id}`
            };
        });
    }

    function onInput(query, command) {
        const queryString = query.trim();

        return fetchNews(queryString).then(results => {
            if (results && results.length) {
                return dataFormat(results);
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
