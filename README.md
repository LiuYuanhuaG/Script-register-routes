# vue3_hook

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

#### 下载依赖和启动命令

```json
  "devDependencies": {
    "ts-node": "^10.4.0",
    "ejs": "^3.1.6",
    "cross-env": "^7.0.3"
  }
# 加入启动和打包命令
 "scripts": {
    "serve": "yarn run biz-init && vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "biz-init": "ts-node scripts/generateBizConfig.ts"
  },
```

#### 写入 node 读取文件脚本

- ### biz-stage-config.ts.ejs

  '../views/<%= plugin.name %>/routes.js' 会根据遍历的每个目录名称拼接一个路径 routes.js 就是查找的文件可以改变

```ejs
//本文件是自动生成，请勿修改
<% plugins.forEach(function (plugin) { %> import <%= plugin.name %> from '../views/<%= plugin.name %>/routes.js';
<% }); %>
export default [
<% plugins.forEach(function (plugin) { %>  <%= plugin.name %>,
<% });
%>]

```

- ### generateBizConfig.ts

```js
const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const ejs = require("ejs")

type IBusinessList = Array<{ name: string; path: string }>
function getAllBiz(source: string): IBusinessList {
  if (!fs.existsSync(source)) {
    console.log(chalk.yellow(`目录不存在${source}`))
    return []
  }
  const folders: Array<string> = fs.readdirSync(source)
  const bizList: IBusinessList = []
  folders.forEach((item) => {
    const itemPath = path.resolve(__dirname, `../src/views/${item}/`)
    bizList.push({
      name: item,
      path: itemPath,
    })
  })
  return bizList
}
//这里根据自身项目目录结构配置
const targetFile: string = path.resolve(__dirname, "../src/router/routes.js")
const bizPath: string = path.resolve(__dirname, "../src/views")
const templatePath: string = path.resolve(__dirname, "./biz-stage-config.ts.ejs")

console.log(chalk.green(`配置插件...`))

const template: Buffer = fs.readFileSync(templatePath, "utf8")
const bizList: IBusinessList = getAllBiz(bizPath)

const result = ejs.render(template, { plugins: bizList })
// console.log(targetFile, template, bizList, result, bizPath)
fs.writeFile(targetFile, result, (err: NodeJS.ErrnoException) => {
  if (err) {
    console.error("write file error", err)
  } else {
    console.log(chalk.green(`配置插件完成: ${targetFile}\n`))
  }
})


```

- #### ./src/routes/index.ts 配置路由全部导入

```js
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

import Routes from "./routes.js"
const flatMap: any = (arr: any) => (Array.isArray(arr) ? arr.reduce((a, b) => [...a, ...flatMap(b)], []) : [arr])

const routes: Array<RouteRecordRaw> = [...flatMap(Routes)]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
export default router

```

