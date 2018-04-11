<!-- loading组件 -->
<template>
    <div class="loading">
        <img width="24" height="24" src="./loading.gif">
        <p class="desc">{{title}}</p>
    </div>
</template>

<script>
export default {
    // 配置父组件可配置得选项
    props: {
        title: {
            type: String,
            default: '正在加载中.....'
        }
    }
}

</script>
<style lang='less' scoped>
@import '~common/less/variable';
    .loading {
        width: 100%;
        text-align: center;
        .desc {
            line-height: 20px;
            font-size: @font-size-small;
            color: @color-text-l;
        }
    }
</style>