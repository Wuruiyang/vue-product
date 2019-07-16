<template>
  <div>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="cat_id" border>
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot="{ row }">
          <span>{{ row.cat_deleted }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain circle icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" plain circle icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  created () {
    this.getCategoryList()
  },
  data () {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    }
  },
  methods: {
    async getCategoryList () {
      const res = await this.axios('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      this.tableData = res.data.result
      console.log(res.data)
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    }
  }
}
</script>

<style>
</style>
