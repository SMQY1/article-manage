import type { App } from 'vue'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { staticRoutes } from './routes/staticRoutes'
import { moduleRoutes } from './modules'
import { configureNProgress } from '@/utils/router'
// import { setupBeforeEachGuard } from './guards/beforeEach'   // 注释掉
// import { setupAfterEachGuard } from './guards/afterEach'     // 注释掉

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRoutes, ...moduleRoutes] as RouteRecordRaw[]
})

export function initRouter(app: App<Element>): void {
  configureNProgress()
  // setupBeforeEachGuard(router)   // 注释掉
  // setupAfterEachGuard(router)    // 注释掉
  app.use(router)
}

export const HOME_PAGE_PATH = '/blog/list'
