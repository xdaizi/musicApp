const Search = (resolve) => {
    import('components/search/search').then(module => {
        resolve(module)
    })
}
const singerDetail = (resolve) => {
    import('components/singer-detail/singer-detail').then(module => {
        resolve(module)
    })
}
const search = {
    path: '/search',
    component: Search,
    children: [
        {
            path: ':id',
            component: singerDetail
        }
    ]
}
export default search