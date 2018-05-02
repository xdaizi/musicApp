<!-- 检索组件 -->
<template>
    <scroll class="suggest"
    :data="result"
    :pullUp="pullUp"
    @pullUpEnd="searchMore"
    ref="scroll"
    >
        <ul class="suggest-list">
            <li class="suggest-item" v-for="(item,index) in result" :key="index">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
        <Loading v-show="hasMore" title=""></Loading>
        </ul>
    </scroll>
</template>

<script>
import { getSearchRes } from 'api/search'
import { ERR_OK } from 'api/config'
import CreateSong from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
// 定义常量记录是否是直达的歌手信息
const TYPE_SINGER = 'singer'
// 定义每一页查询出来的数据
const perpage = 20
export default {
    // 定义外部传递数据
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            page: 1,
            result: [],
            pullUp: true,
            hasMore: true // 定义变量判断是否数据全部加载完
        }
    },
    computed: {
    },
    methods: {
        getIconCls(item) {
            if (item.type === TYPE_SINGER) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },
        getDisplayName(item) {
            if (item.type === TYPE_SINGER) {
                return item.singername
            } else {
                return `${item.name}-${item.singer}`
            }
        },
        searchMore() {
            if (!this.hasMore) {
                return
            }
            this.page++
            getSearchRes(this.query, this.page, this.showSinger, perpage).then(res => {
                if (res.code === ERR_OK) {
                    this.result = this.result.concat(this._genResult(res.data))
                    this._checkHasMore(res.data)
                }
            })
        },
        _getSearchRes() {
            this.hasMore = true
            // page复位
            this.page = 1
            // 滚动复位
            this.$refs.scroll.scrollTo(0, 0)
            getSearchRes(this.query, this.page, this.showSinger, perpage).then(res => {
                if (res.code === ERR_OK) {
                    this.result = this._genResult(res.data)
                    this._checkHasMore(res.data)
                }
            })
        },
        _genResult(data) {
            let ret = []
            if (data.zhida && data.zhida.singerid) {
                ret.push({...data.zhida, ...{type: TYPE_SINGER}})
            }
            if (data.song) {
                ret = ret.concat(this._normalizeSongs(data.song.list))
            }
            return ret
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((musicData) => {
                if (musicData.songid && musicData.albummid) {
                    ret.push(CreateSong(musicData))
                }
            })
            return ret
        },
        _checkHasMore(data) {
            let song = data.song
            // 判断是否加载完毕
            if (!song.list.length || song.curnum + song.curpage * perpage >= song.totalnum) {
                this.hasMore = false
            }
        }
    },
    watch: {
        query(newVal, oldVal) {
            if (newVal === '') {
                this.result = []
                return
            }
            this._getSearchRes()
        }
    },
    components: {
        Scroll,
        Loading
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    @import "~common/less/mixin";
    .suggest {
        height: 100%;
        overflow: hidden;
        .suggest-list {
            padding: 0 30px;
            .suggest-item {
                display: flex;
                align-items: center;
                padding-bottom: 20px;
            }
            .icon {
                flex: 0 0 30px;
                width: 30px;
                [class^="icon-"] {
                    font-size: 14px;
                    color: @color-text-d;
                }
            }
            .name {
                flex: 1;
                font-size: @font-size-medium;
                color: @color-text-d;
                overflow: hidden;
                .text {
                    .no-wrap()
                }
            }
        }
        .no-result-wrapper {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>