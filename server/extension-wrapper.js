const fs = require("fs")
const path = require('path')

extensionsDir = "./extensions"

module.exports = {

    extensions: {},

    /**
     * 加载所有的插件，跳过出错的插件
     */
    async load(app) {
        const list = await fs.readdirSync(path.join(__dirname, extensionsDir))
        for (const key in list) {
            const value = list[key]
            try {
                if (value.endsWith(".js")) {
                    const extension = require(path.join(__dirname, extensionsDir, value))
                    const { name, feature } = extension
                    if ('init' in feature && typeof (feature.init) === 'function')
                        await feature.init(app) // 插件初始化
                    this.extensions[name] = feature
                }
            } catch (e) {
                console.error(e)
                console.warn("extension-wrapper(load):", `${value} load failed, skipped.`)
            }
        }

        console.info("extension-wrapper(load):", `${this.count()} plugin(s) loaded`)
    },

    /**
     * 获取插件数量
     */
    count() {
        let n = 0
        for (const key in this.extensions) {
            n++
        }
        return n
    },

    /**
     * 获取指定插件
     */
    get(name) {
        return this.extensions[name]
    },

    /**
     * 获取插件列表
     */
    getExtensionList() {
        const ext = {}
        for (const key in this.extensions) {
            const { meta } = this.extensions[key]
            ext[key] = meta
        }
        return ext
    }
}