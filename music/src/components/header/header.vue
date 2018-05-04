<!-- 头部组件 -->
<template>
  <div class="header">
    <div class="icon"></div>
    <h1 class="text">音乐播放器</h1>
    <router-link to="/userCenter" tag="div" class="mine">
        <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {
    data() {
        return {

        }
    }
}
</script>
<style lang='less' scoped>
// 导入变量样式文件和混入样式文件
@import '~common/less/variable.less';
@import '~common/less/mixin.less';
    .header {
        position:relative;
        height: 44px;
        text-align: center;
        color: @color-theme;
        font-size:0;
        .icon {
            display:inline-block;
            vertical-align: top;
            margin-top: 6px;
            width: 30px;
            height: 32px;
            margin-right: 9px;
            .bg-image('~components/header/logo');
            background-size:30px 32px;
        }
        .text {
            display:inline-block;
            vertical-align: top;
            line-height: 44px;
            font-size: @font-size-large;
        }
        .mine {
            position: absolute;
            top: 0;
            right: 0;
            .icon-mine {
                display: block;
                padding: 12px;
                font-size: 20px;
                color: @color-theme;
            }
        }
    }
</style>