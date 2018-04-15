<!-- 歌手详情页 -->
<template>
    <transition name="slide">
        <div class="singer-detail">
            歌手详情页
        </div>
    </transition>
</template>

<script>
export default {
    created() {
        console.log('详情页生成')
        // 拿到路由传递过来的参数:id
        // console.log(this.$route.params.id)
    }
}

</script>
<style lang='less' scoped>
    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s;
    }
    .slide-enter,
    .slide-leave-to {
        transform: translate3d(100%,0,0);
    }
    .singer-detail {
        position: fixed;
        z-index: 100;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: cadetblue;
    }
</style>