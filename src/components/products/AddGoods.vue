<template>
  <div>
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <el-tabs
      tab-position="left"
      v-model="activeName"
      style="height: 200px;"
      @tab-click="handleClick"
    >
      <el-tab-pane name="step0" label="基本信息">
        基本信息
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="step1" label="商品图片">
        商品图片
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="step2" label="商品内容">
        商品内容
        <el-button style="margin-top: 12px;">完成</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeName: 'step0'
    }
  },
  methods: {
    next () {
      this.active++
      this.activeName = 'step' + this.active
    },
    // 当tab栏改变时触发
    handleClick (v) {
      console.log(v)
      this.active = +v.index
    }
  }
}
</script>

<style>
</style>
