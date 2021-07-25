module.exports = function (steward) {
  const version = 1;
  const author = "solobat";
  const name = "Crypto Prices";
  const key = "cc";
  const type = "keyword";
  const icon = "https://assets.coingecko.com/coins/images/1/small/bitcoin.png";
  const title = "Cryptocurrency prices";
  const subtitle = "List Cryptocurrency Prices";
  const commands = [
    {
      key,
      type,
      title,
      subtitle,
      icon,
      shiftKey: true,
    },
  ];

  // coingecko coin ids
  const tokens = [
    "bitcoin",
    "binancecoin",
    "ethereum",
    "Filecoin",
    "solana",
    "uniswap",
    "aave",
  ];
  const icons = {
    bitcoin: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    binancecoin: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png',
    ethereum: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    uniswap: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
    solana: 'https://assets.coingecko.com/coins/images/4128/small/coinmarketcap-solana-200.png',
    filecoin: 'https://assets.coingecko.com/coins/images/12817/small/filecoin.png',
    aave: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png'
  }

  function formatName(name) {
    return [name[0].toUpperCase(), name.substr(1)].join("");
  }

  function fetchList() {
    return steward.axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: tokens.join(","),
        vs_currencies: "usd",
      },
    });
  }

  function dataFormat(list) {
    return list.map((item) => {
      return {
        key: "coins",
        universal: true,
        icon: icons[item[0]] || icon,
        title: formatName(item[0]),
        desc: `Price: ${item[1].usd}`,
      };
    });
  }

  function onInput(query, command) {
    return fetchList()
      .then((results) => {
        const resp = results.data;

        if (resp) {
          return dataFormat(Object.entries(resp));
        } else {
          return steward.util.getDefaultResult(command);
        }
      })
      .catch(() => {
        return steward.util.getDefaultResult(command);
      });
  }

  function onEnter(item, command, query, shiftKey, list) {}

  return {
    author,
    version,
    name,
    category: "other",
    icon,
    title,
    commands,
    onInput,
    onEnter,
  };
};
