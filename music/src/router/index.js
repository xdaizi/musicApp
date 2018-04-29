// 配置路由
import Vue from 'vue'
import Router from 'vue-router'
// 引入路由组件(import必须在所有业务逻辑之前)
import Recommend from 'components/recommend/recommend'
import Rank from 'components/rank/rank'
import Singer from 'components/singer/singer'
import Search from 'components/search/search'
import singerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'
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
            component: Recommend,
            children: [
                {
                    path: ':id',
                    component: Disc
                }
            ]
        },
        {
            path: '/rank',
            component: Rank
        },
        {
            path: '/singer',
            component: Singer,
            children: [
                {
                    path: ':id',
                    component: singerDetail
                }
            ]
        },
        {
            path: '/search',
            component: Search
        }
    ]
})