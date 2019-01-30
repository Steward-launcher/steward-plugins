
module.exports = function (steward) {
    const version = 1;
    const author = 'solobat';
    const name = 'Zimuzu hot movies';
    const key = 'zmhot';
    const type = 'keyword';
    const icon = 'https://ws1.sinaimg.cn/large/6836364ely1fzopj47on0j205k05kq2w.jpg';
    const title = 'your plugin';
    const subtitle = '基于 graphql 的网页查询';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon
    }];

    function queryHotMovies() {
        return steward.axios.post('http://site.oksteward.com/graphql', {
            query: `{
              site(url: "http://www.zimuzu.io") {
                hot: selectAll(elem: ".top24 ul li") {
                  title: text(elem: "a")
                  url: href(elem: "a")
                }
              }
            }`
        });
    }

    function onInput(query, command) {
        return queryHotMovies().then(({ data }) => {
            const movies = data.data.site.hot;

            return movies.map(movie => {
                return {
                    universal: true,
                    key: 'url',
                    icon,
                    title: movie.title,
                    url: `http://zimuzu.io${movie.url}`
                }
            });
        });
    }

    function onEnter(item, command, query, keyStatus, list) {
        steward.util.copyToClipboard(item.title, true);
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
