// 配置路由
import Vue from 'vue'
import Router from 'vue-router'
// 引入路由组件(import必须在所有业务逻辑之前)
import Recommend from 'components/recommend/recommend'
import Rank from 'components/rank/rank'
import Singer from 'components/singer/singer'
import Search from 'components/search/search'
// 通过Vue.use()来加载路由
Vue.use(Router)
// 导出路由实例,配置路由规则
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/recommend'
        },
        {
            path: '/recommend',
            component: Recommend
        },
        {
            path: '/rank',
            component: Rank
        },
        {
            path: '/singer',
            component: Singer
        },
        {
            path: '/search',
            component: Search
        }
    ]
})