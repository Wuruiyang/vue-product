<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
html,
body,
#app {
  height: 100%;
  background-color: #ccc;
}
#app {
  .el-breadcrumb {
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    background-color: #ddd;
  }
}
</style>
