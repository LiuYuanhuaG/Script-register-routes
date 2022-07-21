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

