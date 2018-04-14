<!-- 基于scroll基础组件的滚动列表组件 -->
<template>
    <Scroll class="listview" :data="data" ref="listview">
        <ul>
            <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="(item, index) in group.items" :key="index" class="list-group-item">
                        <img v-lazy="item.avatar" alt="" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart.stop.prevent="shotcutTouchS" @touchmove.stop.prevent="shotcutM">
            <li v-for="(item, index) in shotcutData" :key="index" :data-index="index" class="item">{{item}}</li>
        </div>
    </Scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {dealDomInfo} from 'common/js/dom'
// 定义shortcut的每个item的高
const ANCHOR_HEIGHT = 18
export default {
    // 定义需要外部传入得数据
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    created() {
        this.touch = {} // 存储touch事件开始得位置,结束的位置等
    },
    computed: {
        // 快速入口数据
        shotcutData() {
            return this.data.map((item) => {
                return item.title.slice(0, 1)
            })
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
        _scrollTo(index) {
            let dom = this.$refs.listGroup[index]
            this.$refs.listview.scrollToElement(dom, 1)
        }
    },
    components: {
        Scroll
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
            top: 0;
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