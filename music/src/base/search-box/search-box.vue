<!-- 搜索框组件 -->
<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input class="box" v-model="query" :placeholder="placeholder"/>
        <i v-show="query" @click="clear" class="icon-dismiss"></i>
    </div>
</template>

<script>
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
        // 当内容变化时,向外部派发事件
        this.$watch('query', (newVal) => {
            // console.log('派发事件')
            this.$emit('queryChange', newVal)
        })
    },
    methods: {
        clear() {
            this.query = ''
        },
        setQuery(query) {
            this.query = query
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