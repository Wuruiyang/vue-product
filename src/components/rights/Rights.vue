<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightsData" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级">
        <template v-slot:default="{ row: { level } }">
          <span v-if="+level === 0">一级</span>
          <span v-else-if="+level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  created () {
    this.getRightList()
  },
  data () {
    return {
      rightsData: []
    }
  },
  methods: {
    async getRightList () {
      const { data, meta } = await this.axios.get('rights/list')
      if (meta.status === 200) {
        this.rightsData = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style>
</style>
