// singer模块鲈鱼
const Singer = (resolve) => {
    import('components/singer/singer').then(module => {
        resolve(module)
    })
}
const singerDetail = (resolve) => {
    import('components/singer-detail/singer-detail').then(module => {
        resolve(module)
    })
}
const singer = {
    path: '/singer',
    component: Singer,
    children: [
        {
            path: ':id',
            component: singerDetail
        }
    ]
}
export default singer