import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

import Routes from "./routes.js"
const flatMap: any = (arr: any) => (Array.isArray(arr) ? arr.reduce((a, b) => [...a, ...flatMap(b)], []) : [arr])

const routes: Array<RouteRecordRaw> = [...flatMap(Routes)]

console.log(routes)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
console.log(router, "router")

export default router

