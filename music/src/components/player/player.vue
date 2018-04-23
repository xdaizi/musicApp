<!-- 播放器组件 -->
<template>
    <div class="player" v-if="playList.length">
        <!-- 动画钩子 -->
        <transition name="normal"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdCls">
                                <img class="image" :src="currentSong.image">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric"></div>
                        </div>
                    </div>
                    <!-- <scroll class="middle-r" ref="lyricList">
                        <div class="lyric-wrapper">
                            <div>
                                <p></p>
                            </div>
                        </div>
                    </scroll> -->
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l"></span>
                        <div class="progress-bar-wrapper">
                            <!-- <progress-bar></progress-bar> -->
                        </div>
                        <span class="time time-r"></span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i></i>
                        </div>
                        <div class="icon i-left" @click="prev">
                            <i class="icon-prev"></i>
                        </div>
                        <div class="icon i-center" @click="togglePlaying">
                            <i :class="playIcon"></i>
                        </div>
                        <div class="icon i-right" @click="next">
                            <i class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img :class="cdCls" width="40" height="40" :src="currentSong.image">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <!-- <progress-circle>
                    </progress-circle> -->
                    <i :class="miniIcon" @click.stop="togglePlaying"></i>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error"></audio>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { getVkey } from 'api/singer'
import { ERR_OK, GUID } from 'api/config'
import animations from 'create-keyframe-animation'
export default {
    data() {
        return {
            readyPlay: false
        }
    },
    computed: {
        playIcon() {
            return this.playing ? 'icon-pause' : 'icon-play'
        },
        miniIcon() {
            return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },
        cdCls() {
            return this.playing ? 'play' : 'play pause'
        },
        ...mapGetters([
            'playList',
            'fullScreen',
            'currentSong',
            'playing',
            'currentIndex'
        ])
    },
    methods: {
        ready() {
            this.readyPlay = true
            this.$refs.audio.play()
        },
        error() {},
        back() {
            this.setFullScreen(false)
        },
        open() {
            this.setFullScreen(true)
        },
        togglePlaying() {
            const audio = this.$refs.audio
            this.$nextTick(() => {
                this.playing ? audio.pause() : audio.play()
                this.setPlayingState(!this.playing)
            })
        },
        prev() {
            if (!this.readyPlay) return
            this.readyPlay = false
            let index = this.currentIndex - 1
            if (index === -1) index = this.playList.length - 1
            if (this.playList[index].urlFlag) {
                this.setCurrentIndex({index})
            } else {
                this._getKey(this.playList[index], index)
            }
        },
        next() {
            if (!this.readyPlay) return
            this.readyPlay = false
            let index = this.currentIndex + 1
            if (index === this.playList.length) index = 0
            if (this.playList[index].urlFlag) {
                this.setCurrentIndex({index})
            } else {
                this._getKey(this.playList[index], index)
            }
        },
        // el: dom,done:下一步动作的回调
        enter(el, done) {
            const {x, y, scale} = this._getPosAndScale()
            // 定义动画
            let animation = {
                0: {
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
            }
            // 注册动画
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })
            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter() {
            // 注销动画
            animations.unregisterAnimation('move')
            // 恢复样式
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el, done) {
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const {x, y, scale} = this._getPosAndScale()
            this.$refs.cdWrapper.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave() {
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style['transform'] = ''
        },
        _getKey(item, index) {
            getVkey(item).then(res => {
                let result = ''
                if (res.code === ERR_OK) {
                    result = res.data.items[0]['vkey']
                    result = 'http://dl.stream.qqmusic.qq.com/C400' + item.mid + '.m4a?vkey=' + result + '&guid=' + GUID + '&uin=0&fromtag=66'
                    this.setCurrentIndex({index: index, url: result})
                }
            })
        },
        _getPosAndScale() {
            const targetWidth = 40
            const paddingLeft = 40
            const paddingBottom = 30
            const paddingTop = 80
            const width = window.innerWidth * 0.8
            const scale = targetWidth / width
            const x = -(window.innerWidth / 2 - paddingLeft)
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
            return {x, y, scale}
        },
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX'
        })
    },
    watch: {
        currentIndex(newVal, oldVal) {
            if (newVal === oldVal) return
            this.readyPlay = true
        }
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    @import "~common/less/mixin";
    .player {
        .normal-player {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 150;
            background: @color-background;
            .background {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                opacity: 0.6;
                filter: blur(20px);
            }
            .top {
                position: relative;
                margin-bottom: 25px ;
                .back {
                    position: absolute;
                    top: 0;
                    left: 6px;
                    z-index: 50;
                    .icon-back {
                        display: block;
                        padding: 9px;
                        font-size: @font-size-large-x;;
                        color: @color-theme;
                        transform: rotate(-90deg);
                    }
                }
                .title {
                    width: 70%;
                    margin: 0 auto;
                    line-height: 40px;
                    text-align: center;
                    .no-wrap();
                    font-size: @font-size-large;
                    color: @color-text;
                }
                .subtitle {
                    line-height: 20px;
                    text-align: center;
                    font-size: @font-size-medium;
                    color: @color-text;
                }
            }
            .middle {
                position: fixed;
                width: 100%;
                top: 80px;
                bottom: 170px;
                white-space: nowrap;
                font-size: 0;
                .middle-l {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-top: 80%;
                    .cd-wrapper {
                        position: absolute;
                        left: 10%;
                        top: 0;
                        width: 80%;
                        height: 100%;
                        .cd {
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border: 10px solid rgba(255, 255, 255, 0.1);
                            border-radius: 50%;
                            &.play {
                                animation: rotate 20s linear infinite
                            }
                            &.pause {
                                animation-play-state: paused
                            }
                            .image {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
                    }
                    .playing-lyric-wrapper {
                        width: 80%;
                        margin: 30px auto 0 auto;
                        overflow: hidden;
                        text-align: center;
                        .playing-lyric {
                            height: 20px;
                            line-height: 20px;
                            font-size: @font-size-medium;
                            color: @color-text-l;
                        }
                    }
                }
                .middle-r {
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    .lyric-wrapper {
                        width: 80%;
                        margin: 0 auto;
                        overflow: hidden;
                        text-align: center;
                        .text {
                            line-height: 32px;
                            color: @color-text-l;
                            font-size: @font-size-medium;
                            &.current {
                                color: @color-text
                            }
                        }
                    }
                }
            }
            .bottom {
                position: absolute;
                bottom: 50px;
                width: 100%;
                .dot-wrapper {
                    text-align: center;
                    font-size: 0;
                    .dot {
                        display: inline-block;
                        vertical-align: middle;
                        margin: 0 4px;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: @color-text-l;
                        &.active {
                            width: 20px;
                            border-radius: 5px;
                            background: @color-text-ll;
                        }
                    }
                }
                .progress-wrapper {
                    display: flex;
                    align-items: center;
                    width: 80%;
                    margin: 0px auto;
                    padding: 10px 0;
                    .time {
                        color: @color-text;
                        font-size: @font-size-small;
                        flex: 0 0 30px;
                        line-height: 30px;
                        width: 30px;
                        &.time-l {
                            text-align: left
                        }
                        &.time-r {
                            text-align: right
                        }
                    }
                    .progress-bar-wrapper {
                        flex: 1;
                    }
                }
                .operators {
                    display: flex;
                    align-items: center;
                    .icon {
                        flex: 1;
                        color: @color-theme;
                        &.disable {
                            color: @color-theme-d
                        }
                        i {
                            font-size: 30px
                        }
                    }
                    .i-left {
                       text-align: right
                    }
                    .i-center {
                        padding: 0 20px;
                         text-align: center;
                         i {
                             font-size: 40px
                         }
                    }
                    .i-right {
                        text-align: left
                    }
                    .icon-favorite {
                        color: @color-sub-theme
                    }
                }
            }
            &.normal-enter-active,
            &.normal-leave-active {
                transition: all 0.4s;
                .top, .bottom {
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
                }
            }
            &.normal-enter,
            &.normal-leave-to {
                opacity: 0;
                .top {
                    transform: translate3d(0, -100px, 0)
                }
                .bottom {
                    transform: translate3d(0, 100px, 0)
                }
            }
        }
        .mini-player {
            display: flex;
            align-items: center;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 180;
            width: 100%;
            height: 60px;
            background: @color-highlight-background;
            &.mini-enter-active,
            &.mini-leave-active {
                transition: all 0.4s
            }
            &.mini-enter,
            &.mini-leave-to {
                opacity: 0
            }
            .icon {
                flex: 0 0 40px;
                width: 40px;
                padding: 0 10px 0 20px;
                img {
                    border-radius: 50%;
                    &.play {
                        animation: rotate 10s linear infinite
                    }
                    &.pause {
                        animation-play-state: paused
                    }
                }
            }
            .text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                line-height: 20px;
                overflow: hidden;
                .name {
                    margin-bottom: 2px;
                    .no-wrap();
                    font-size: @font-size-medium;
                    color: @color-text;
                }
                .desc {
                    .no-wrap();
                    font-size: @font-size-small;
                    color: @color-text-d;
                }
            }
            .control {
                flex: 0 0 30px;
                width: 30px;
                padding: 0 10px;
                .icon-play-mini,
                .icon-pause-mini,
                .icon-playlist {
                    font-size: 30px;
                    color: @color-theme-d;
                }
                .icon-mini {
                    font-size: 32px;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            }
        }
    }
    @keyframes rotate {
        0% {
            transform: rotate(0)
        }
        100% {
            transform: rotate(360deg)
        }
    }
</style>