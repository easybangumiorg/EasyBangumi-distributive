const express = require('express')
const { extensiosWrapper, proxy } = require('./server')
const cors = require('cors')

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

async function main() {
    const app = express()

    // CROS策略，默认允许所有源和所有方法
    app.use("*", cors());

    // 向网页提交分布式纯纯看番基本信息
    app.get('/', (req, res) => {
        res.json({
            code: 200,
            msg: 'Hello EasyBangumi!',
            server: 'easyBangumi-distributive',
            data: {
                version: "v1.1b",
                proxy: "/proxy",
            }
        })
    })

    // 分布式代理，根据源的情况对资源进行代理访问
    // TODO 这里需要一个能够处理流的代理，之后也要跟进头扩展等功能
    app.all('/proxy', proxy.parser, proxy.runner)

    // 列出所有可用的插件源
    app.get('/list', async function (req, res) {
        const ext = extensiosWrapper.getExtensionList()
        res.json({
            code: 200,
            data: ext
        })
    })

    // 获取番剧源的详细信息
    app.get('/source/:source', async (req, res) => {
        const source = req.params["source"]
        const ext = extensiosWrapper.get(source)
        if (ext == undefined) {
            res.status(404).json({
                code: 404,
                msg: "There is no such source."
            })
        }

        res.json({
            code: 200,
            data: ext.meta
        })
    })

    // 获取番剧详细信息
    app.get('/source/:source/id/:id', async (req, res) => {
        const source = req.params["source"]
        const ext = extensiosWrapper.get(source)
        if (ext == undefined) {
            res.status(404).json({
                code: 404,
                msg: "There is no such source."
            })
        }

        const id = req.params["id"]
        try {
            const bangumiInfo = await ext.getBangumiInfoByID(id)

            res.json({
                code: 200,
                data: bangumiInfo
            })
        } catch (err) {
            console.error(err)
            res.status(404).json({
                code: 404,
                msg: "Target source exception."
            })
        }
    })

    // 获取番剧播放地址
    app.get('/source/:source/id/:id/line/:line/episod/:episod', async (req, res) => {
        const source = req.params["source"]
        const ext = extensiosWrapper.get(source)
        if (ext == undefined) {
            res.status(404).json({
                code: 404,
                msg: "There is no such source."
            })
        }

        const id = req.params["id"]
        const line = req.params["line"]
        const episod = req.params["episod"]
        try {
            const playInfo = await ext.getPlayUrl(id, line, episod)
            const useProxy = ext.meta.proxy

            res.json({
                code: 200,
                data: playInfo,
                useProxy
            })
        } catch (err) {
            console.error(err)
            res.status(404).json({
                code: 404,
                msg: "Target source exception."
            })
        }
    })

    // 获取番剧源分类信息
    app.get('/source/:source/class/:tid', async (req, res) => {
        const source = req.params["source"]
        const ext = extensiosWrapper.get(source)
        if (ext == undefined) {
            res.status(404).json({
                code: 404,
                msg: "There is no such source."
            })
        }

        const tid = req.params["tid"]

        try {
            const classList = await ext.getClassListByID(tid)

            res.json({
                code: 200,
                data: classList,
            })
        } catch (err) {
            console.error(err)
            res.status(404).json({
                code: 404,
                msg: "Target source exception."
            })
        }
    })

    // 获取番剧源所有分类
    app.get('/source/:source/class', async (req, res) => {
        const source = req.params["source"]
        const ext = extensiosWrapper.get(source)
        if (ext == undefined) {
            res.status(404).json({
                code: 404,
                msg: "There is no such source."
            })
        }

        try {
            const classes = await ext.getClassList()

            res.json({
                code: 200,
                data: classes,
            })
        } catch (err) {
            console.error(err)
            res.status(404).json({
                code: 404,
                msg: "Target source exception."
            })
        }
    })

    await extensiosWrapper.load(app)

    app.listen(2383, () => {
        console.log(`EasyBangumi distributive app listening on port ${2383}`)
    })
}

main()