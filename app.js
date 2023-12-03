const express = require('express');
const path = require('path');
const mustache = require('mustache');
const fs = require('fs')
const axios = require('axios');
const dotenv = require('dotenv');

const appConfig = require('./configuration')

const { subscriptions, filter, endpoints, port } = appConfig

dotenv.config({ path: '.env' });

const app = express();
const env = process.env || {}

const parser = async (source) => {
    const response = await axios.get(source);

    // 获取响应数据
    const responseData = response.data;
    let inRange = false
    const lines = responseData.split('\n')
    const result = []
    for (const line of lines) {
        if (String(line).toLowerCase().indexOf('[proxy]') >= 0) {
            inRange = true
        }

        if (inRange && String(line).toLowerCase().indexOf('[proxy group]') >= 0) {
            inRange = false
        }

        if (inRange && line.indexOf('[Pro]') === 0 && line.indexOf('hybrid=true') < 0) {
            result.push(`${line.replace('skip-cert-verify=false', 'skip-cert-verify=true')}, hybrid=true`)
            continue
        }
        if (line.indexOf('#!MANAGED-CONFIG') >= 0) {
            result.push(`#!MANAGED-CONFIG ${env.exportName} interval=86400 strict=false`)
            continue
        }
        result.push(line)

    }

    return result.join('\n')
}

const params = {
    domain: env.domain,
    source: `${env.subconverter}/sub?target=surge&ver=4&url=${subscriptions.join('%7C')}&include=(${filter.include.join('%7C')})&config=${env.domain}/config.ini?t=${Date.now()}&exclude=(${encodeURIComponent(filter.exclude.join('|'))})&emoji=false&udp=true&sort=true&scv=false&list=false&expand=true&enable_cache=false`,
    ...endpoints
}

// 定义 GET 接口
app.get('/', async (req, res) => {
    res.send(await parser(params.source));
});

// 静态资源配置
app.use('/static/rules', express.static(path.join(__dirname, 'rules')));

// 模板渲染的 custom.ini, rulebase.conf
app.get('/config.ini', (req, res) => {
    // 使用 mustache 渲染模板
    const template = fs.readFileSync(path.join(__dirname, './template/config.mustache')).toString();

    const renderedContent = mustache.render(template, params);
    // 发送渲染后的内容
    res.send(renderedContent);
});

app.get('/rulebase.conf', (req, res) => {
    // 使用 mustache 渲染模板
    const template = fs.readFileSync(path.join(__dirname, './template/rulebase.mustache')).toString();

    const renderedContent = mustache.render(template, params);
    // 发送渲染后的内容
    res.send(renderedContent);
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
