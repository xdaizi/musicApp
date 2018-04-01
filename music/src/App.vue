<template>
  <div id="app">
    hello,word
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped lang='less'>
  @import 'common/less/variable.less';
  #app {
    color:@color-theme;
  }
</style>
