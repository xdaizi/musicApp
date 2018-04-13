<!--  -->
<template>
    <div class="singer">
        <ListView :data='singersList'></ListView>
    </div>
</template>

<script>
import {getSingers} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singers from 'common/js/singer'
import ListView from 'base/listview/listview'
const HOT_NAME = '热门人气'
const HOT_LEN = 10
export default {
    data() {
        return {
            // 存储歌手信息
            singersList: []
        }
    },
    created() {
        this._getSingers()
    },
    methods: {
        _getSingers() {
            getSingers().then((res) => {
                if (res.code === ERR_OK) {
                    let data = this._formatSinger(res.data.list)
                    this.singersList = this._normSinger(data)
                    console.log(this.singersList)
                }
            })
        },
        // 格式化歌手数据
        _formatSinger(list) {
            if (!list) return
            let temp = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            }
            list.forEach((v, i) => {
                if (i < HOT_LEN) {
                    temp.hot.items.push(new Singers({
                        id: v.Fsinger_mid,
                        name: v.Fsinger_name
                    }))
                }
                const key = v.Findex
                if (!temp[key]) {
                    temp[key] = {
                        title: key,
                        items: []
                    }
                }
                temp[key].items.push(new Singers({
                    id: v.Fsinger_mid,
                    name: v.Fsinger_name
                }))
            })
            return temp
        },
        // 将格式化得数据按照需求进行排列,目的是得到一个有序得二维数组
        _normSinger(data) {
            if (!data) return
            let hot = []
            let ret = []
            for (let k in data) {
                let val = data[k]
                if (val.title.match(/[a-zA-Z]/)) {
                    ret.push(val)
                } else if (val.title === HOT_NAME) {
                    hot.push(val)
                }
            }
            // 将热门数据进行排序
            // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            hot.push(...ret)
            return hot
        }
    },
    components: {
        ListView
    }
}
</script>
<style lang='less' scoped>
    .singer {
        position: fixed;
        top: 88px;
        bottom: 0;
        width: 100%;
    }
</style>