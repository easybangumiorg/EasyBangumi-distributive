const fs = require("fs")
const path = require('path')
const express = require('express')

const icon = ""

module.exports = {
    name: "local",
    feature: {
        meta: { // 元信息，固定格式，在初始化过后应冻结
            tag: "local", // 源的标签，要求与上层name相同
            name: "本地源", // 源的实际名称，可以是任何字符串
            description: "本地动漫源", // 源的描述
            version: "0.1", // 源的版本
            self: true, // 源的属性，是否为私有
            proxy: false, // 源代理配置，默认为true，所有内容走分布式后端代理
            icon,

            /**
             * [features] 番剧源功能
             * 
             * basic: 基本方法
             *  getBangumiInfoByID  根据id获取番剧信息
             *  getPlayUrl          根据id、播放列表（line）、集数（episod）获取播放链接
             * 
             * class: 基本分类汇总
             *  getClassList        获取所有分类
             *  getClassListByID    获取分类中所有的视频
             * 
             * search: 基本搜索功能
             *  search              搜索
             */
            features: "basic,class"
        },

        data: { // 源活动数据
            base: "C:\\Users\\ayala\\Desktop\\EasyBangumi\\EasyBangumi-distributive\\example", // 本地源位置
            db: null, // 源数据库
            loaded: false, // 源加载是否成功
            minDBversion: 2, // 最小支持数据库版本
        },

        async init(app) {
            // 源初始化函数
            const dir = this.data.base
            console.info("local(init):", this.data.base)
            if (!await fs.existsSync(dir) && !await fs.statSync(dir).isDirectory()) {
                throw TypeError("Directory does not exist or not a directory.")
            }

            const db = require(path.join(this.data.base, 'index.json'))

            if (!'schema' in db
                && typeof (db.schema) !== 'string'
                && db.schema !== 'easybangumi-local-database') {
                throw TypeError("Database not matched.")
            }

            if (db.version < this.data.minDBversion) {
                throw TypeError("The source database version is too low.")
            }

            console.log("local(init):", "source database version:", db.version)
            this.data.db = db
            app.use(`/source/${this.meta.tag}/static`, express.static(this.data.base))
        },

        async getBangumiInfoByID(id) {
            // 根据id获取番剧信息
            const db = this.data.db
            const target = db.source.find(i => i.id == id)
            if (!target) {
                throw SyntaxError("target not find")
            }

            const play_list = { '本地': [] }

            target.play_list.forEach(ep => {
                play_list['本地'].push(ep.episod)
            });

            const coverUrl = path.join(`/source/${this.meta.tag}/static`, target.coverUrl)

            return {
                id: target.id,
                tid: target.tid,
                title: target.title,
                coverUrl,
                description: target.description,
                tags: target.tags,
                actor: target.actor,
                director: target.director,
                writer: target.writer,
                pubdate: target.pubdate,
                score: target.score,
                source: this.meta.tag,
                play_list
            }
        },

        async getPlayUrl(id, line, episod) {
            // 根据id、播放列表（line）、集数（episod）获取播放链接
            const db = this.data.db
            const target = db.source.find(i => i.id == id)
            if (!target) {
                throw SyntaxError("target not find")
            }

            const ep = target.play_list[episod]
            if (ep.path.startsWith("http")) {
                return {
                    path: ep.path,
                    type: ep.type
                }
            } else {
                return {
                    path: path.join(`/source/${this.meta.tag}/static`, ep.path),
                    type: ep.type
                }
            }
        },

        async getClassList() {
            // 获取所有分类
            const db = this.data.db
            return db.class
        },

        async getClassListByID(tid) {
            // 获取分类中所有的视频
            const db = this.data.db
            const target = db.class.find(i => i.tid == tid)
            if (!target) {
                throw SyntaxError("target not find")
            }

            const list = []
            db.source.filter(i => i.tid == tid).forEach(i => {
                const coverUrl = path.join(`/source/${this.meta.tag}/static`, i.coverUrl)

                list.push({
                    id: i.id,
                    tid: i.tid,
                    title: i.title,
                    coverUrl,
                    pubdate: i.pubdate,
                    score: null,
                    source: this.meta.tag,
                })
            })

            return list
        },

    }
}