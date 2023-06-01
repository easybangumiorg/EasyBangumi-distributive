# 分布式纯纯看番 - 本地源

## 如何使用

让我们打开编辑插件文件，我们会见到以下内容：

```js
module.exports = {
    name: "local",
    feature: {
        meta: { // 元信息，固定格式，在初始化过后应冻结
            tag: "local", // 源的标签，要求与上层name相同
            name: "本地源", // 源的实际名称，可以是任何字符串
            description: "本地动漫源", // 源的描述
            version: "1.1", // 源的版本
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
            base: "D://Movices", // 本地源位置
            db: null, // 源数据库
            loaded: false // 源加载是否成功
        },
... // 此处省略
```

第一步，如果你需要添加多个本地源，需要确保每一个本地源插件的 `name` 必须唯一且不包含特殊字符，其次是 `feature -> meta -> tag` 也必须和 `name` 一致。

第二步，更改 `feature -> data -> base` ，采用绝对路径到你的源仓库，这将会导致这个目录暴露在http服务器上，请确保没有重要文件。

第三步，在原仓库根目录下创建 `index.json` 索引文件，文件格式见下文。

第四步，将插件文件移动到分布式纯纯看番服务器路径的 `/server/extensions` 下。

随后启动分布式纯纯看番服务器即可。

## 索引文件的结构

```json
// index.json
{
    // 当产生破坏性的更改时，索引文件的版本号更改，目前为2
    "version": 2, 

    // 用于标识这是一个分布式纯纯看番的数据库文件
    "schema": "easybangumi-local-database",

    // 数据列表
    "source": [
        {
            // 项目id
            "id": 1001,

            // 项目类型，与分类列表对应
            "tid": 1,

            // 项目标题
            "title": "",

            // 项目图标路径，相对路径
            "coverUrl": "",

            // 项目描述
            "description": "",

            // 项目标签
            "tags": "",

            // 演员
            "actor": "",

            // 导演
            "director": "",

            // 编剧
            "writer": "",

            // 上传日期 年-月-日
            "pubdate": "",

            // 评分
            "score": null,

            // 播放列表
            "play_list": [
                {
                    // 集名称
                    "episod": "",

                    // 集路径
                    "path": "",

                    // 集分类 video,markdown,audio,file,hls,image,none
                    "type": ""
                }
            ]
        }
    ],

    // 分类列表
    "class": [
        {
            // 分类id
            "tid": 1,

            // 分类名称
            "name": "",

            // 分类描述
            "description": ""
        }
    ]
}
```
