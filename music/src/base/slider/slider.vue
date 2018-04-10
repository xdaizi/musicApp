<!--轮播图组件  -->
<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup" @touchstart = '_cancelAutoPlay'>
          <slot></slot>
      </div>
      <div class="dots">
          <span class="dot" v-for="(item, index) in dots" :key="item" :class="{active:index === currentPageIndex}"></span>
      </div>
  </div>
</template>

<script>
// 动态得添加类名,来控制轮播图得样式
import {addClass} from 'common/js/dom'
// 引入better-scroll
import BScroll from 'better-scroll'
export default {
    // 作为轮播图组件,需要提供以下接口
    props: {
        // 是否轮播
        loop: {
            type: Boolean,
            default: true
        },
        // 是否自动轮播
        autoPlay: {
            type: Boolean,
            default: true
        },
        // 间隔时间
        interval: {
            type: Number,
            default: 2000
        },
        // 运动事件
        speed: {
            type: Number,
            default: 400
        }
    },
    data() {
        return {
            // dots的数组
            dots: [],
            // 当前展示页
            currentPageIndex: 0
        }
    },
    mounted() {
        // 初始化轮播图
        this.$nextTick(() => {
            this._setSliderWidth()
            this._initDots()
            this._initSlider()
            if (this.autoPlay) {
                this._play()
            }
        })
        // 当改变窗口大小时,要重新计算
        window.addEventListener('resize', () => {
            if (!this.slider) {
                return
            }
            this._setSliderWidth(true)
            // refresh:重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
            this.slider.refresh()
        })
    },
    methods: {
        // 初始化轮播图得宽度
        _setSliderWidth(isResize) {
            this.children = this.$refs.sliderGroup.children
            let width = 0
            let sliderWidth = this.$refs.slider.clientWidth
            for (let i = 0, len = this.children.length; i < len; i++) {
                let child = this.children[i]
                // 加上类名
                addClass(this.children[i], 'slider-item')
                child.style.width = sliderWidth + 'px'
                // 容器总宽 n * sliderWidth
                width += sliderWidth
            }
            // 如果为自动轮播,前后需要各克隆一个item,改变窗口大小时不需要
            if (this.loop && !isResize) {
                width += 2 * sliderWidth
            }
            // 设置轮播容器得总宽度
            this.$refs.sliderGroup.style.width = width + 'px'
        },
        // 初始化dots的个数,_initSlider会克隆元素,所以要在其之前初始化
        _initDots() {
            this.dots = new Array(this.children.length)
        },
        // 初始化轮播图得配置
        _initSlider() {
            this.slider = new BScroll(this.$refs.slider, {
                startX: 0,
                scrollX: true,
                // 开启横向滚动
                scrollY: false,
                // 关闭纵向滚动
                momentum: false,
                // 关闭惯性
                snap: {
                    loop: this.loop,
                    // 轮播间隔
                    threshold: 0.3,
                    speed: this.speed
                    // 轮播的速度
                },
                bounce: false,
                // 滚动超过便的回弹动画
                stopPropagation: true
                // 阻止冒泡
            })
            // scrollEnd:缓动结束是触发
            this.slider.on('scrollEnd', () => {
                // getCurrentPage() 获得当前展示页信息
                let pageIndex = this.slider.getCurrentPage().pageX
                this.currentPageIndex = pageIndex
                // console.log(pageIndex)
                if (this.autoPlay) {
                    clearTimeout(this.timer)
                    this._play()
                }
            })
        },
        // 自动播放
        _play() {
            this.timer = setTimeout(() => {
                // next() 下一页
                this.slider.next(this.speed)
            }, this.interval)
        },
        _cancelAutoPlay() {
            // 手动滑动时取消自动效果
            clearTimeout(this.timer)
        }
    },
    destroyed() {
        // 销毁时清除定时器
        clearTimeout(this.timer)
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    .slider {
        min-height: 1px;
        .slider-group {
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            .slider-item {
                float: left;
                box-sizing: border-box;
                overflow: hidden;
                text-align: center;
                a {
                    display: block;
                    width: 100%;
                    overflow: hidden;
                    text-decoration: none;
                    img {
                        display: block;
                        width: 100%;
                    }
                }
            }
        }
        .dots {
            position: absolute;
            right: 0;
            left: 0;
            bottom: 12px;
            text-align: center;
            font-size: 0;
            .dot {
                display: inline-block;
                margin: 0 4px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: @color-text-l;
                &.active {
                    width: 20px;
                    border-radius: 5px;
                    background: @color-theme-d;
                }
            }
        }
    }
</style>