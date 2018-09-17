const UserCenter = (resolve) => {
    import('components/user-center/user-center').then(module => {
        resolve(module)
    })
}
const userCenter = {
    path: '/userCenter',
    component: UserCenter
}
export default userCenter