<!-- 基于scroll基础组件的滚动列表组件 -->
<template>
    <Scroll class="listview"
            ref="listview"
            :data="data"
            :listenScroll="listenScroll"
            @scroll="listScroll"
            :probeType="probeType"
            >
        <ul>
            <li v-for="(group, index) in data" :key="index"
            class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="(item, index) in group.items" :key="index"
                    class="list-group-item">
                        <img v-lazy="item.avatar" alt="" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut"
        @touchstart.stop.prevent="shotcutTouchS"
        @touchmove.stop.prevent="shotcutM">
            <li v-for="(item, index) in shotcutData" :key="index"
            :data-index="index"
            class="item"
            :class="{current:index == currentIndex}">{{item}}</li>
        </div>
        <div class="list-fixed" v-show="fixedTitle" :style="{transform:tranLate}">
            <div class="fixed-title">{{fixedTitle}}</div>
        </div>
        <div class="loading-container" v-if="!data.length">
            <loading></loading>
        </div>
    </Scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {dealDomInfo} from 'common/js/dom'
import Loading from 'base/loading/loading'
// 定义shortcut的每个item的高
const ANCHOR_HEIGHT = 18
// 定义导航栏的高度
const TITLE_HEIGHT = 30
export default {
    // 定义需要外部传入得数据
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            currentIndex: 0, // 记录当前的shortcut激活项
            scrollY: -1, // 滚动的距离
            groupHeight: [], // 记录每个分类得高度
            diffY: 0 // 用来判断group的上限与固定标题的距离,方便又滑动代替效果
        }
    },
    created() {
        this.touch = {} // 存储touch事件开始得位置,结束的位置等
        this.listenScroll = true // 是否监听滚动组件的滚动事件
        this.probeType = 3 // 传递probeType的类型
    },
    computed: {
        // 快速入口数据
        shotcutData() {
            return this.data.map((item) => {
                return item.title.slice(0, 1)
            })
        },
        fixedTitle() {
            if (this.scrollY > 0) {
                return ''
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        },
        tranLate() {
            let diffY
            if (this.diffY > 0) {
                diffY = this.diffY < TITLE_HEIGHT ? TITLE_HEIGHT - this.diffY : 0
                return `translateY(-${diffY}px)`
            }
        }
    },
    watch: {
        data() {
            setTimeout(() => {
                this._calculateHeight()
            }, 20)
        }
    },
    methods: {
        // 点击快速入口,列表滑动到相应的位置
        shotcutTouchS(e) {
            let index = dealDomInfo(e.target, 'index')
            this.touch.y1 = e.touches[0].pageY
            // index:string类型
            this.touch.anchorIndex = Number(index)
            this._scrollTo(index)
        },
        // 滑动时,列表也跟着滑动
        shotcutM(e) {
            this.touch.y2 = e.touches[0].pageY
            let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
            let index = this.touch.anchorIndex + delta
            this._scrollTo(index)
        },
        listScroll(pos) {
            let scrollY = this.scrollY = pos.y
            let group = this.groupHeight
            // 1.当scrollY>0,即顶部且向上拉
            if (scrollY > 0) {
                this.currentIndex = 0
                return
            }
            // 2.中间部分滚动
            for (let i = 0, l = group.length - 1; i < l; i++) {
                let height1 = group[i]
                let height2 = group[i + 1]
                this.diffY = height2 - (-scrollY)
                if (-scrollY >= height1 && -scrollY < height2) {
                    this.currentIndex = i
                    return
                }
            }
            // 3.当大于最后一项得上线时
            this.currentIndex = group.length - 1
        },
        _scrollTo(index) {
            // 边界处理(点击上下没有字幕得地方)
            if (!index && index !== 0) {
                return
            }
            // 边界处理,当滑动到上下边界时
            if (index < 0) {
                index = 0
            } else if (index > this.$refs.listGroup.length - 1) {
                index = this.$refs.listGroup.length - 1
            }
            let dom = this.$refs.listGroup[index]
            this.currentIndex = index
            this.$refs.listview.scrollToElement(dom, 1)
        },
        // 计算每个分类的高度
        _calculateHeight() {
            const list = this.$refs.listGroup
            let height = 0
            list.map((item) => {
                this.groupHeight.push(height)
                height += item.clientHeight
            })
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
    .listview {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: @color-background;
        .list-group {
            padding-bottom: 30px;
            .list-group-title {
                height: 30px;
                line-height: 30px;
                padding-left: 20px;
                font-size: @font-size-small;
                color: @color-text-l;
                background: @color-highlight-background;
            }
            .list-group-item {
                display: flex;
                align-items: center;
                padding: 20px 0 0 30px;
                .avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                };
                .name {
                    margin-left: 20px;
                    color: @color-text-l;
                    font-size: @font-size-medium;
                };
            }
        }
        .list-shortcut {
            position: absolute;
            z-index: 30;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            padding: 20px 0;
            border-radius: 10px;
            text-align: center;
            background: @color-background-d;
            font-family: Helvetica;
            .item {
                padding: 3px;
                line-height: 1;
                color: @color-text-l;
                font-size: @font-size-small;
                &.current {
                    color: @color-theme;
                }
            }

        }
        .list-fixed {
            position: absolute;
            top: -1px;
            left: 0;
            width: 100%;
            .fixed-title {
                height: 30px;
                line-height: 30px;
                padding-left: 20px;
                font-size: @font-size-small;
                color: @color-text-l;
                background: @color-highlight-background;
            };
        }
        .loading-container {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>