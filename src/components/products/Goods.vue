<template>
  <div>
    <el-button type="primary" @click="$router.push('/good-add')">添加商品</el-button>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="{ row }">{{row.add_time | dataFilter}}</template>
      </el-table-column>
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
    this.getGoodList()
  },
  data () {
    return {
      pagenum: 1,
      pagesize: 10,
      total: 0,
      tableData: []
    }
  },
  methods: {
    async getGoodList () {
      const res = await this.axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      const { data, meta } = res
      if (meta.status === 200) {
        this.tableData = data.goods
        this.total = data.total
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getGoodList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodList()
    }
  }
}
</script>

<style>
</style>
