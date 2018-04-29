<!-- 推荐页面 -->
<template>
    <div class="recommend" ref="recommend">
        <Scroll class="recommend-content" ref="scroll" :data="songList" :click="click">
            <div>
                <div class="slider-wrapper" v-if="recommends.length">
                    <slider>
                        <div v-for="item in recommends" :key="item.id">
                            <a :href="item.linkUrl">
                                <img class="needsclick"  :src="item.picUrl" @load.once = 'luadImg' alt="">
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li v-for="(item, index) in songList" :key="index" class="item" @click="selectItem(item)">
                            <div class="icon">
                                <img v-lazy="item.imgurl" alt="" width="60" height="60">
                            </div>
                            <div class="text">
                                <h2 class="name">{{item.creator.name}}</h2>
                                <p class="desc">{{item.dissname}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!songList.length">
                <loading></loading>
            </div>
        </Scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import {getRecommend, getSingList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
export default {
    mixins: [playlistMixin],
    data() {
        return {
            recommends: [], // 用来存推荐页面得轮播图数据
            songList: [] // 用来存储歌单列表
        }
    },
    created() {
        // 两个接口数据都是异步的,但必须是两者都渲染才是能计算Scroll组件得高度
        this._getRecommend()
        this._getSingList()
        this.click = true
    },
    methods: {
        handlePlaylist(list) {
            const bottom = list.length > 0 ? '60px' : ''
            this.$refs.recommend.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        selectItem(item) {
            this.setDisc(item)
            this.$router.push({
                path: `/recommend/${item.dissid}`
            })
        },
        _getRecommend() {
            getRecommend().then(res => {
                if (res.code === ERR_OK) {
                    this.recommends = res.data.slider
                }
            })
        },
        _getSingList() {
            getSingList().then(res => {
                if (res.code === ERR_OK) {
                    this.songList = res.data.list
                }
            })
        },
        luadImg() {
            // 数据异步,所以当轮播图得img请求回来时,必须再次计算scroll得高度
            // 利用事件修饰符,once保证触发一次就行
            this.$refs.scroll.refresh()
        },
        ...mapMutations({
            setDisc: 'SET_DISC'
        })
    },
    components: {
        Slider,
        Scroll,
        Loading
    }
}

</script>
<style lang='less' scoped>
    @import '~common/less/variable';
    .recommend {
        position: fixed;
        width: 100%;
        top: 88px;
        bottom: 0;
        .recommend-content {
            height: 100%;
            overflow: hidden;
        }
        .slider-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
        }
        .recommend-list {
            .list-title {
                height: 65px;
                line-height: 65px;
                text-align: center;
                font-size: @font-size-medium;
                color: @color-theme;
            }
            .item {
                display: flex;
                box-sizing: border-box;
                align-items: center;
                padding: 0 20px 20px 20px;
                .icon {
                    flex: 0 0 60px;
                    width: 60px;
                    padding-right: 20px;
                }
                .text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex: 1;
                    line-height: 20px;
                    overflow: hidden;
                    font-size: @font-size-medium;
                    .name {
                        margin-bottom: 10px;
                        color: @color-text;
                    }
                    .desc {
                        color: @color-text-d;
                    }
                }
            }
        }
        .loading-container {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>