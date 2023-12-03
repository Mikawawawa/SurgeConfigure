const config = {
    subscriptions: [
        `https://example.com`,
    ],
    filter: {
        include: ['HK', 'TW', 'SG', 'US', "JP"],
        exclude: ['域名', '剩余', '游戏']
    },
    endpoints: {
        proxyTest: `http://cp.cloudflare.com/generate_204`,
        domesticTest: `http://baidu.com`,
    },
    port: 3001
}