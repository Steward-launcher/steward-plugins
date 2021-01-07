
module.exports = function (steward) {
    const version = 5;
    const author = 'solobat';
    const name = 'Console';
    const key = '>';
    const type = 'keyword';
    const icon = 'https://i.imgur.com/Z2qwSNT.png';
    const title = 'console';
    const subtitle = 'execute javascript code';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon
    }];

    const results = [];

    function dataFormat(list) {
        return list.map(item => {
            return {
                title: item.result,
                desc: item.code,
                icon
            }
        });
    }

    function onInput(query, command) {
        if (results.length) {
            return Promise.resolve(dataFormat(results));
        } else {
            return steward.util.getDefaultResult(command);
        }
    }

    const $ = new Proxy({}, {
        get(target, prop) {
            console.log(prop);

            switch (prop) {
                case 'now':
                    return steward.dayjs().format("YYYY-MM-DD HH:mm:ss");
                case 'unix':
                    return steward.dayjs().unix();
                default:
                    return void 0;
            }
        }
    });

    function onEnter(item, command, query, shiftKey, list) {
        if (query) {
            let result;
            const day = steward.dayjs;
            const http = steward.axios;

            try {
                result = eval(query);

                if (result === null) {
                    result = 'null';
                }

                if (result === undefined) {
                    result = 'undefined';
                }
            } catch (error) {
                result = error.message;
            } finally {
                results.unshift({
                    result: result.toString(),
                    code: query
                });

                window.stewardApp.app.applyCommand('> ');
            }
        } else {
            steward.util.copyToClipboard(item.title, true);
        }

        return Promise.resolve(true);
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
