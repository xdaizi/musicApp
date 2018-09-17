const Recommend = (resolve) => {
    import('components/recommend/recommend').then(module => {
        resolve(module)
    })
}
const Disc = (resolve) => {
    import('components/disc/disc').then(module => {
        resolve(module)
    })
}
const routerObj = {
    path: '/',
    redirect: '/recommend'
}
const recommendObj = {
    path: '/recommend',
    component: Recommend,
    children: [
        {
            path: ':id',
            component: Disc
        }
    ]
}
export default [routerObj, recommendObj]