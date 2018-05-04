<!-- 播放器组件 -->
<template>
    <div class="player" v-if="playList.length && innerState">
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
                <div class="middle" @touchstart.prevent="middleTS" @touchmove.prevent="middleTM" @touchend="middleTE">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdCls">
                                <img class="image" :src="currentSong.image">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.length">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine" class="text"
                                v-for="(line,index) in currentLyric.lines" :key="index"
                                :class="{'current':currentLineNum === index}"
                                >{{line.txt}}</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @changePercent="dealPercent"></progress-bar>
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
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
                <progress-circle :percent="percent" :radius="radius">
                    <div class="control">
                        <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
                    </div>
                </progress-circle>
                <div class="control" @click.stop="playlistShow">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <playlist ref="playlist"></playlist>
        <audio :src="realUrl" ref="audio" @ended="ended" @canplay="ready" @error="error" @timeupdate="timeUpdate"></audio>
    </div>
</template>

<script>
import progressBar from 'base/progress-bar/progress-bar'
import progressCircle from 'base/progress-circle/progress-circle'
import scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import animations from 'create-keyframe-animation'
import { shuffle } from 'common/js/util'
import Lyric from 'lyric-parser'
export default {
    data() {
        return {
            readyPlay: false, // 是否播放
            currentTime: 0, // 当前得播放时间
            radius: 32,
            currentLyric: null, // 歌词
            currentLineNum: 0, // 当前行数
            currentShow: 'cd', // 表示为显示歌词还是cd
            playingLyric: '' // 当前得歌词
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
        percent() {
            return this.currentTime / this.currentSong.duration
        },
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        },
        realUrl() {
            if (this.currentSong.urlFlag) {
                return this.currentSong.url
            }
        },
        ...mapGetters([
            'playList',
            'fullScreen',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList',
            'innerState'
        ])
    },
    created() {
        this.touch = {} // 定义touch用来存储滑动的信息
    },
    methods: {
        ready() {
            if (!this.readyPlay) {
                this.readyPlay = true
            }
            if (!this.playing) this.togglePlaying()
            this.$refs.audio.play()
        },
        error() {
            if (!this.readyPlay) {
                this.readyPlay = true
            }
        },
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
            // 歌曲得播放状态决定歌词得播放状态
            if (this.currentLyric) {
                this.currentLyric.togglePlay()
            }
        },
        prev() {
            if (!this.readyPlay) return
            this.readyPlay = false
            // 歌曲只有一条时,直接条用loop
            if (this.playList.length === 1) {
                this._loop()
                return
            }
            let index = this.currentIndex - 1
            if (index === -1) index = this.playList.length - 1
            this.setCurrentIndexAsyn(index)
        },
        next() {
            if (!this.readyPlay) return
            this.readyPlay = false
            if (this.playList.length === 1) {
                this._loop()
                return
            }
            let index = this.currentIndex + 1
            if (index === this.playList.length) index = 0
            this.setCurrentIndexAsyn(index)
        },
        ended() {
            // 播放结束时自动播放下一曲
            if (this.mode === playMode.loop) {
                this._loop()
            } else {
                this.next()
                this.currentTime = 0
            }
        },
        _loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            // 循环播放时,重新歌词置顶
            if (this.currentLyric) {
                this.currentLyric.seek(0)
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
        timeUpdate(e) {
            this.currentTime = e.target.currentTime
        },
        format(time) {
            const min = time / 60 | 0
            const sec = this.__pad(time % 60 | 0)
            return `${min}:${sec} `
        },
        dealPercent(percent) {
            const currentTime = this.currentSong.duration * percent
            this.$refs.audio.currentTime = currentTime
            //  暂停 -> 播放
            if (!this.playing) this.togglePlaying()
            // 改变歌词得位置
            if (this.currentLyric) this.currentLyric.seek(currentTime * 1000)
        },
        changeMode() {
            let mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            // 改变播放模式 --->改变播放列表
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            // 要先设置index
            this._resetIndex(list)
            this.setPlayList(list)
        },
        getLyric() {
            this.currentSong.getLyric().then((lyric) => {
                this.currentLyric = new Lyric(lyric, this.handleLyric)
                if (this.playing) {
                    this.currentLyric.play()
                }
                // console.log(this.currentLyric)
            }).catch(() => {
                // 异常处理
                this.currentLyric = null
                this.currentLineNum = 0
                this.playingLyric = ''
            })
        },
        handleLyric({lineNum, txt}) {
            if (!this.$refs.lyricList) return
            this.currentLineNum = lineNum
            if (lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum - 5]
                this.$refs.lyricList.scrollToElement(lineEl, 1000)
            } else {
                this.$refs.lyricList.scrollTo(0, 0, 1000)
            }
            this.playingLyric = txt
        },
        middleTS(e) {
            this.touch.init = true
            const touch = e.touches[0]
            this.touch.startX = touch.pageX
            this.touch.startY = touch.pageY
        },
        middleTM(e) {
            // console.log('进入touch!!!!')
            if (!this.touch.init) return
            const touch = e.touches[0]
            let deltaX = touch.pageX - this.touch.startX
            let deltaY = touch.pageY - this.touch.startY
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                return
            }
            let offsetX
            // 当为cd时,偏移为0,歌词时偏移为-window.innerWidth
            const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
            offsetX = Math.min(Math.max(-window.innerWidth, left + deltaX), 0)
            // 记录偏移得百分比
            this.touch.percent = Math.abs(offsetX / window.innerWidth)
            // this.$refs.lyricList是组件,要取其$el操作
            this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetX}px, 0, 0)`
            this.$refs.lyricList.$el.style['opacity'] = this.touch.percent
            this.$refs.lyricList.$el.style['transition'] = `all 0ms`
            this.$refs.middleL.style['opacity'] = 1 - this.touch.percent
            this.$refs.middleL.style['transition'] = `all 0ms`
        },
        middleTE() {
            if (!this.touch.init) return
            let percent = this.touch.percent
            let offsetX, opacity
            if (this.currentShow === 'cd') {
                offsetX = 0
                opacity = 0
                if (percent > 0.1) {
                    offsetX = -window.innerWidth
                    opacity = 1
                    this.currentShow = 'lyric'
                }
            } else {
                offsetX = -window.innerWidth
                opacity = 1
                if (percent < 0.9) {
                    offsetX = 0
                    opacity = 0
                    this.currentShow = 'cd'
                }
            }
            const time = 300
            this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetX}px, 0, 0)`
            this.$refs.lyricList.$el.style.opacity = opacity
            this.$refs.lyricList.$el.style['transition'] = `all ${time}ms`
            this.$refs.middleL.style['opacity'] = 1 - opacity
            this.$refs.middleL.style['transition'] = `all ${time}ms`
        },
        playlistShow() {
            this.$refs.playlist.show()
        },
        // 重置currentIndex
        _resetIndex(list) {
            if (!list || !list.length) return
            let index = list.findIndex(item => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        // 格式化事件
        __pad(num, n = 2) {
            let len = num.toString().length
            while (len < n) {
                num = `0${num}`
                len++
            }
            return num
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
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAY_LIST'
        }),
        ...mapActions([
            'setCurrentIndexAsyn'
        ])
    },
    watch: {
        currentSong(newVal, oldVal) {
            if (!newVal.id || newVal.id === oldVal.id) return
            if (!this.readyPlay) {
                this.readyPlay = true
            }
            // 换歌曲的时候清理歌词
            if (this.currentLyric) {
                this.currentLyric.stop()
                this.currentTime = 0
                this.playingLyric = ''
                this.currentLineNum = 0
            }
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.$refs.audio.play()
                this.getLyric()
            }, 1000)
        }
    },
    components: {
        progressBar,
        progressCircle,
        scroll,
        Playlist
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