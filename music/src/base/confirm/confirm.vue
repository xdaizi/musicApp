<!-- 弹出窗组件 -->
<template>
    <transition name="confirm-fade">
        <div class="confirm" v-show="showFlag" @click.stop>
            <div class="confirm-wrapper">
                <div class="confirm-content">
                    <p class="text">{{text}}</p>
                    <div class="operate">
                        <div class="operate-btn left" @click.stop="confirm">{{confirmBtnText}}</div>
                        <div class="operate-btn" @click="cancel">{{cancelBtnText}}</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    // 定义外部需要传入的参数
    props: {
        text: {
            type: String,
            default: ''
        },
        confirmBtnText: {
            type: String,
            default: '确定'
        },
        cancelBtnText: {
            type: String,
            default: '取消'
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
        },
        hide() {
            this.showFlag = false
        },
        confirm() {
            this.hide()
            // 派发事件外部处理
            this.$emit('confirm')
        },
        cancel() {
            this.hide()
            // 派发事件外部处理
            this.$emit('cancel')
        }
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    .confirm {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 998;
        background-color: @color-background-d;
        &.confirm-fade-enter-active {
            animation: confirm-fadein 0.3s;
            .confirm-content {
                animation: confirm-zoom 0.3s;
            }
        }
        .confirm-wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999;
            .confirm-content {
                width: 270px;
                border-radius: 13px;
                background: @color-highlight-background;
                .text {
                    padding: 19px 15px;
                    line-height: 22px;
                    text-align: center;
                    font-size: @font-size-large;
                    color: @color-text-l;
                }
                .operate {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    font-size: @font-size-large;
                    .operate-btn {
                        flex: 1;
                        line-height: 22px;
                        padding: 10px 0;
                        border-top: 1px solid @color-background-d;
                        color: @color-text-d;
                        &.left {
                             border-right: 1px solid @color-background-d;
                        }
                    }
                }
            }
        }
    };
    @keyframes confirm-fadein {
        0% {
            opacity: 0
        }
        100% {
            opacity: 1
        }
    }
    @keyframes confirm-zoom {
        0% {
            transform: scale(0)
        }
        50% {
            transform: scale(1.1)
        }
        100% {
            transform: scale(1)
        }
    }
</style>