import blogRoutes from './blog'
// import { articleRoutes } from './article'   // 注释掉
import { dashboardRoutes } from './dashboard'
import { examplesRoutes } from './examples'
import { exceptionRoutes } from './exception'
import { helpRoutes } from './help'
import { resultRoutes } from './result'
import { safeguardRoutes } from './safeguard'
import { systemRoutes } from './system'
import { templateRoutes } from './template'
import { widgetsRoutes } from './widgets'

export const moduleRoutes = [
  blogRoutes,
  // articleRoutes,        // 注释掉
  dashboardRoutes,
  examplesRoutes,
  exceptionRoutes,
  ...helpRoutes,
  resultRoutes,
  safeguardRoutes,
  systemRoutes,
  templateRoutes,
  widgetsRoutes
]
