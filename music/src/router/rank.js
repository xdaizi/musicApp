// rank模块鲈鱼
const Rank = (resolve) => {
    import('components/rank/rank').then(module => {
        resolve(module)
    })
}
const TopList = (resolve) => {
    import('components/top-list/top-list').then(module => {
        resolve(module)
    })
}
const rank = {
    path: '/rank',
    component: Rank,
    children: [
        {
            path: ':id',
            component: TopList
        }
    ]
}
export default rank