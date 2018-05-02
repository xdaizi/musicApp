<!-- 搜索框组件 -->
<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input class="box" ref="searchInput" v-model="query" :placeholder="placeholder"/>
        <i v-show="query" @click="clear" class="icon-dismiss"></i>
    </div>
</template>

<script>
import { debounce } from 'common/js/util'
export default {
    // 定义外部需要传递的参数
    props: {
        placeholder: {
            type: String,
            default: '搜索歌曲、歌手'
        }
    },
    data() {
        return {
            query: ''
        }
    },
    created() {
        // 当内容变化时,向外部派发事件 --- 应进行节流处理
        this.$watch('query', debounce((newVal) => {
            this.$emit('queryChange', newVal)
        }, 200))
    },
    methods: {
        clear() {
            this.query = ''
        },
        // 注册方法供外部调用,从而实现功能封装和闭环
        setQuery(query) {
            this.query = query
        },
        blurInput() {
            this.$refs.searchInput.blur()
        }
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    .search-box {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        padding: 0 6px;
        height: 40px;
        background: @color-highlight-background;
        border-radius: 6px;
        .icon-search {
            font-size: 24px;
            color: @color-background;
        }
        .box {
            flex: 1;
            margin: 0 5px;
            line-height: 18px;
            background: @color-highlight-background;
            color: @color-text;
            font-size: @font-size-medium;
            &::placeholder {
                color: @color-text-d;
            }
        }
        .icon-dismiss {
            font-size: 16px;
            color: @color-background;
        }
    }
</style>