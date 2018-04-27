<!-- 进度条组件 -->
<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="touchS"
            @touchmove.prevent="touchM"
            @touchend="touchE"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
const BTN_WIDTH = 16
export default {
    // 定义需要传递进来得数据
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    created() {
        this.touch = {
            realy: false
        }
    },
    methods: {
        touchS(e) {
            this.touch.realy = true
            this.touch.startX = e.touches[0].pageX
            this.touch.left = this.$refs.progress.clientWidth
        },
        touchM(e) {
            if (!this.touch.realy) return
            const wrapperWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH
            let moveX = e.touches[0].pageX
            let datilX = Math.min(this.touch.left + moveX - this.touch.startX, wrapperWidth)
            datilX = Math.max(datilX, 0)
            this._setStyle(datilX)
        },
        touchE(e) {
            this.touch.realy = false
            this._triggerPercent() // 通知外部变化
        },
        progressClick(e) {
            // getBoundingClientRect()获得信息独享
            const rect = this.$refs.progressBar.getBoundingClientRect()
            let offsetX = e.pageX - rect.left
            // 由于点击button时会产生问题,所以不用e.offsetX
            this._setStyle(offsetX)
            this._triggerPercent()
        },
        _triggerPercent() {
            const barWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH
            const percent = this.$refs.progress.clientWidth / barWidth
            this.$emit('changePercent', percent)
        },
        _setStyle(width) {
            this.$refs.progress.style.width = `${width}px`
            this.$refs.progressBtn.style.transform = `translate3d(${width}px,0,0)`
        }
    },
    watch: {
        percent(newVal, oldVal) {
            // 滑动时和watch相斥
            if (this.touch.realy) return
            if (newVal <= 0 || newVal === oldVal || (!this.$refs.progressBar)) return
            const barWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH
            let width = barWidth * newVal
            this._setStyle(width)
        }
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    .progress-bar {
        height: 30px;
        .bar-inner {
            position: relative;
            top: 13px;
            height: 4px;
            background: rgba(0, 0, 0, 0.3);
            .progress {
                position: absolute;
                height: 100%;
                background: @color-theme;
            }
            .progress-btn-wrapper {
                position: absolute;
                left: -8px;
                top: -13px;
                width: 30px;
                height: 30px;
                .progress-btn {
                    position: relative;
                    top: 7px;
                    left: 7px;
                    box-sizing: border-box;
                    width: 16px;
                    height: 16px;
                    border: 3px solid @color-text;
                    border-radius: 50%;
                    background: @color-theme;
                }
            }
        }
    }
</style>