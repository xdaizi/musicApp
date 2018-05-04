<!-- 检索组件 -->
<template>
    <scroll class="suggest"
    :data="result"
    :pullUp="pullUp"
    :click="click"
    :beforeScrollStart="beforeScrollStart"
    @pullUpEnd="searchMore"
    @scrollStart="onScrollStart"
    ref="scroll"
    >
        <ul class="suggest-list">
            <li class="suggest-item" @click="selectItem(item)" v-for="(item,index) in result" :key="index">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <Loading v-show="hasMore" title=""></Loading>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore && result.length===0">
            <no-result title="抱歉,没有搜索到相应内容"></no-result>
        </div>
    </scroll>
</template>

<script>
import { getSearchRes } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapMutations, mapActions } from 'vuex'
import { createSong } from 'common/js/song'
import Singer from 'common/js/singer'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
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
    created() {
        this.click = true
        this.beforeScrollStart = true
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
        selectItem(item) {
            if (item.type === TYPE_SINGER) {
                const singer = new Singer({
                    id: item.singermid,
                    name: item.singername
                })
                this.$router.push({
                    path: `/search/${singer.id}`
                })
                this.setSinger(singer)
            } else {
                // 插入歌曲
                // this._getKey(item)
                this.insertSong(item)
            }
            // 派发事件,保存搜索历史,保证功能得闭环
            this.$emit('selectItem')
        },
        onScrollStart() {
            // console.log('滚动开始之前')
            this.$emit('scrollStart')
        },
        refresh() {
            this.scroll && this.scroll.refresh()
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
                    ret.push(createSong(musicData))
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
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
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
        Loading,
        NoResult
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    @import "~common/less/mixin";
    .suggest {
        height: 100%;
        overflow: hidden;
        position: relative;
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