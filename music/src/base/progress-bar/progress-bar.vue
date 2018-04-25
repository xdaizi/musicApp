<!-- 进度条组件 -->
<template>
    <div class="progress-bar" ref="progressBar">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn">
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
    watch: {
        percent(newVal, oldVal) {
            if (newVal <= 0 || newVal === oldVal || (!this.$refs.progressBar)) return
            const barWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH
            let width = barWidth * newVal
            this.$refs.progress.style.width = `${width}px`
            this.$refs.progressBtn.style.transform = `translate3d(${width}px,0,0)`
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