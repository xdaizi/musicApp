<!-- 音乐组件 -->
<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper" :style="playStyle" @click="randomPlay">
                <div class="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" :style="filterStyle"></div>
        </div>
        <div class="bg-layer" :style="bgLayerStyle"></div>
        <scroll :data="songs" :click="click" :probeType="probeType" :listenScroll="listenScroll" @scroll="dealScroll" class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :songs="songs" @select="selectItem"></song-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'
const TITLR_HEIGHT = 40
export default {
    // 定义接收的参数
    props: {
        // 背景图
        bgImage: {
            type: String,
            default: ''
        },
        // 歌曲列表
        songs: {
            type: Array,
            default: () => []
        },
        // 标题
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            posY: 0
        }
    },
    created() {
        this.probeType = 3
        this.listenScroll = true
        this.click = true
    },
    mounted() {
        // 只需要用来做判断的值,可以不用放在data中,因为vue会给data,props中得变量设置getter和setter,浪费性能
        this.bgHeight = this.$refs.bgImage.clientHeight
        this.$refs.list.$el.style.top = this.bgHeight + 'px'
    },
    methods: {
        dealScroll(pos) {
            this.posY = pos.y
        },
        back() {
            this.$router.back()
        },
        selectItem(item, index, url) {
            this.selectPlay({list: this.songs, index: index, url: url})
        },
        randomPlay() {
            this.setRandomPlay({list: this.songs})
        },
        ...mapActions([
            'selectPlay',
            'setRandomPlay'
        ])
    },
    computed: {
        // layer样式
        bgLayerStyle() {
            let offY = this.posY
            let maxY = -(this.bgHeight - TITLR_HEIGHT)
            offY = offY < maxY ? maxY : offY
            return {
                transform: `translate3d(0, ${offY}px, 0)`
            }
        },
        // filter样式
        filterStyle() {
            let offY = this.posY
            let percent = Math.abs(offY / this.bgHeight) || 0
            let blur = 0
            // 向上滚动高斯模糊
            if (offY < 0) {
                blur = Math.min(20 * percent, 20)
            }
            return {
                backdropFilter: `blur${blur}px`
            }
        },
        // bgImage样式
        bgStyle() {
            let offY = this.posY
            let maxY = -(this.bgHeight - TITLR_HEIGHT)
            let zIndex = offY < maxY ? 10 : 0
            let height = 0
            let scale = 1
            let percent = Math.abs(offY / this.bgHeight) || 0
            let paddingTop = '70%'
            if (zIndex === 10) {
                height = TITLR_HEIGHT
                paddingTop = 0
            }
            // 向下图片放大,向上图片高斯模糊
            if (offY > 0) {
                scale = scale + percent
                zIndex = 10
            }
            return {
                backgroundImage: `url(${this.bgImage})`,
                zIndex: zIndex,
                height: `${height}px`,
                paddingTop: paddingTop,
                transform: `scale(${scale})`,
                blur: blur
            }
        },
        // 播放按钮样式
        playStyle() {
            let offY = this.posY
            let maxY = -(this.bgHeight - TITLR_HEIGHT)
            let display = offY < maxY ? 'none' : 'block'
            return {
                display: display
            }
        }
    },
    components: {
        Scroll,
        SongList,
        Loading
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    @import "~common/less/mixin";
    .music-list {
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: @color-background;
        .back {
            position: absolute;
            top: 0;
            left: 6px;
            z-index: 50;
            .icon-back {
                display: block;
                padding: 10px;
                font-size: @font-size-large-x;
                color: @color-theme;
            }
        }
        .title {
            position: absolute;
            top: 0;
            left: 10%;
            z-index: 40;
            width: 80%;
            .no-wrap();
            text-align: center;
            line-height: 40px;
            font-size: @font-size-large;
            color: @color-text;
        }
        .bg-image {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 70%;
            transform-origin: top;
            background-size: cover;
            .play-wrapper {
                position: absolute;
                bottom: 20px;
                z-index: 50;
                width: 100%;
                .play {
                    box-sizing: border-box;
                    width: 135px;
                    padding: 7px 0;
                    margin: 0 auto;
                    text-align: center;
                    border: 1px solid @color-theme;
                    color: @color-theme;
                    border-radius: 100px;
                    font-size: 0;
                    .icon-play {
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 6px;
                        font-size: @font-size-medium-x;
                    }
                    .text {
                        display: inline-block;
                        vertical-align: middle;
                        font-size: @font-size-small;
                    }
                }
            }
            .filter {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(7, 17, 27, 0.4);
            }
        }
        .bg-layer {
            position: relative;
            height: 100%;
            background: @color-background;
        }
        .list {
            position: fixed;
            top: 0;
            bottom: 0;
            width: 100%;
            background: @color-background;
            // overflow: hidden;
            .song-list-wrapper {
                padding: 20px 30px
            }
            .loading-container {
                position: absolute;
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
            }
        }
        .hidden {
            display: none
        }
    }
</style>