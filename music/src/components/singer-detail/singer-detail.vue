<!-- 歌手详情页 -->
<template>
    <transition name="slide">
        <div class="singer-detail">
            歌手详情页
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
export default {
    created() {
        // 拿到路由传递过来的参数:id
        // console.log(this.$route.params.id)
        console.log(this.singer)
        this._getSingerDetail()
    },
    computed: {
        ...mapGetters([
            'singer' // this.singer映射为this.$store.getters.singer
        ])
    },
    methods: {
        _getSingerDetail() {
            // 当前页刷新拿不到singer时回到歌手页面
            if (!this.singer.id) {
                this.$router.push({
                    path: '/singer'
                })
                return
            }
            getSingerDetail(this.singer.id).then(res => {
                if (res.code === ERR_OK) {
                    console.log(res.data.list)
                }
            })
        }
    }
}

</script>
<style lang='less' scoped>
    @import '~common/less/variable';
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
        background: @color-background;
    }
</style>