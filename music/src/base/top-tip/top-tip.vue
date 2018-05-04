<!-- topTip组件 -->
<template>
    <transition name="drop">
        <div class="top-tip" v-show="showFlag" @click.stop="hide">
            <slot></slot>
        </div>
  </transition>
</template>

<script>
export default {
    // 定义外不可以传入的值
    props: {
        // 延时消失的时间
        delay: {
            type: Number,
            default: 2000
        }
    },
    data() {
        return {
            showFlag: false
        }
    },
    methods: {
        show() {
            this.showFlag = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.hide()
            }, this.delay)
        },
        hide() {
            this.showFlag = false
        }
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    .top-tip {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 500;
        background: @color-dialog-background;
        &.drop-enter-active, &.drop-leave-active {
            transition: all 0.3s
        }
        &.drop-enter, &.drop-leave-to {
            transform: translate3d(0, -100%, 0)
        }
    }
</style>