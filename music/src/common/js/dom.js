// 用来提供dom操作得方法
/**
 * @param {*} dom 元素
 * @param {*} className 需要添加得类名
 */
export function addClass(dom, className) {
    if (hasClass(dom, className)) return
    let newClass = [className, ...dom.className]
    dom.className = newClass
}
// 用来判断dom是否有此类名
/**
 * @param {*} dom 元素
 * @param {*} className 类名
 */
export function hasClass(dom, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(dom.className)
}
/**
 * @param {*} ele dom
 * @param {*} name 属性名,这里主要是获取data-的属性,如data-index,name:index即可
 * @param {*} val 属性值
 */
export function dealDomInfo(ele, name, val) {
    name = `data-${name}`
    if (val) {
        return ele.setAttribute(name, val)
    }
    return ele.getAttribute(name)
}