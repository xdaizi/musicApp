// 配置路由
import Vue from 'vue'
import Router from 'vue-router'
import singerRouter from './singer'
import rankRouter from './rank'
import userRouter from './userCenter'
import searchRouter from './search'
import recommendRouter from './recommend'
let routes = []
const routerList = [recommendRouter, searchRouter, userRouter, rankRouter, singerRouter]
function mergeRouter(list) {
    list.forEach((v, i) => {
        if (v instanceof Array) {
            routes = [...routes, ...v]
        } else if (v instanceof Object) {
            routes.push(v)
        } else {
            console.error(`routerList中第${i}个元素必须Object或者Array`)
        }
    })
}
mergeRouter(routerList)
// 引入路由组件(import必须在所有业务逻辑之前)
// import Recommend from 'components/recommend/recommend'
// import Rank from 'components/rank/rank'
// import Singer from 'components/singer/singer'
// import Search from 'components/search/search'
// import singerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'
// 利用路由懒加载
// const Recommend = (resolve) => {
//     import('components/recommend/recommend').then(module => {
//         resolve(module)
//     })
// }
// const Rank = (resolve) => {
//     import('components/rank/rank').then(module => {
//         resolve(module)
//     })
// }
// const Singer = (resolve) => {
//     import('components/singer/singer').then(module => {
//         resolve(module)
//     })
// }
// const Search = (resolve) => {
//     import('components/search/search').then(module => {
//         resolve(module)
//     })
// }
// const singerDetail = (resolve) => {
//     import('components/singer-detail/singer-detail').then(module => {
//         resolve(module)
//     })
// }
// const Disc = (resolve) => {
//     import('components/disc/disc').then(module => {
//         resolve(module)
//     })
// }
// const TopList = (resolve) => {
//     import('components/top-list/top-list').then(module => {
//         resolve(module)
//     })
// }
// const UserCenter = (resolve) => {
//     import('components/user-center/user-center').then(module => {
//         resolve(module)
//     })
// }
// 通过Vue.use()来加载路由
Vue.use(Router)
// 导出路由实例,配置路由规则
export default new Router({
    routes
    // routes: [
    //     // {
    //     //     path: '/',
    //     //     redirect: '/recommend'
    //     // },
    //     // {
    //     //     path: '/recommend',
    //     //     component: Recommend,
    //     //     children: [
    //     //         {
    //     //             path: ':id',
    //     //             component: Disc
    //     //         }
    //     //     ]
    //     // },
    //     // recommendRouter,
    //     // {
    //     //     path: '/rank',
    //     //     component: Rank,
    //     //     children: [
    //     //         {
    //     //             path: ':id',
    //     //             component: TopList
    //     //         }
    //     //     ]
    //     // },
    //     rankRouter,
    //     // {
    //     //     path: '/singer',
    //     //     component: Singer,
    //     //     children: [
    //     //         {
    //     //             path: ':id',
    //     //             component: singerDetail
    //     //         }
    //     //     ]
    //     // },
    //     singerRouter,
    //     // {
    //     //     path: '/search',
    //     //     component: Search,
    //     //     children: [
    //     //         {
    //     //             path: ':id',
    //     //             component: singerDetail
    //     //         }
    //     //     ]
    //     // },
    //     searchRouter,
    //     // {
    //     //     path: '/userCenter',
    //     //     component: UserCenter
    //     // }
    //     userRouter
    // ]
})