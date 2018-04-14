<!-- 滚动列表组件 -->
<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script>
// 引入betterScroll
import BScroll from 'better-scroll'
export default {
    // 定义外部引用该组件是可能需要得参数
    props: {
        // 是否在滚动得时候派发滚动事件
        probeType: {
            type: Number,
            default: 1
        },
        // 是否阻止原生得click事件
        click: {
            type: Boolean,
            default: false
        },
        // 用来接收数据,从而在数据发生变化的时候重新计算,如上拉刷新等
        data: {
            type: Array,
            default: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this._initScroll()
        })
    },
    methods: {
        // 初始化scroll
        _initScroll() {
            // 不存在时返回
            if (!this.$refs.wrapper) {
                return
            }
            // 初始化scroll与props建立联系
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click
            })
        },
        // 代理一些better-scroll得方法,方便调用
        // 启用 better-scroll
        enable() {
            this.scroll && this.scroll.enable()
        },
        // 禁用 better-scroll
        disable() {
            this.scroll && this.scroll.disable()
        },
        // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
        refresh() {
            this.scroll && this.scroll.refresh()
        },
        // 滚动到指定的位置
        scrollTo(...val) {
            this.scroll && this.scroll.scrollTo(...val)
        },
        // 滚动到指定的目标元素。
        scrollToElement(...val) {
            this.scroll && this.scroll.scrollToElement(...val)
        }
    },
    watch: {
        // 当数据发生变化时,刷新组件
        data() {
            setTimeout(() => {
                this.refresh()
            })
        }
    }
}

</script>
<style lang='less' scoped>
</style>