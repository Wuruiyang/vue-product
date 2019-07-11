<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin: 15px 0;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
      </el-input>
      <el-button style="margin-left: 30px;" type="success" plain>添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="username" label="日期"></el-table-column>
      <el-table-column prop="email" label="姓名"></el-table-column>
      <el-table-column prop="mobile" label="日期"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="{ row }">
          <el-switch
            v-model="row.mg_state"
            @change="changestate(row.id, row.mg_state)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template v-slot:default="{ row }">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" @click="deleteuser(row.id)" icon="el-icon-delete" circle></el-button>
          <el-button type="success" round>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      this.axios
        .get('users', {
          // 在params里面写需要传递的参数
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
          // 原本这里需要配置header: {Authorization: localStorage.getItem('token')}
        })
        .then(res => {
          // console.log(res)
          const { meta, data } = res
          if (meta.status === 200) {
            this.tableData = data.users
            this.total = data.total
          }
        })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    deleteuser (id) {
      console.log(id)
      this.axios
        .delete(`users/${id}`)
        .then(res => {
          const { meta } = res
          if (meta.status === 200) {
            this.$message.success('已删除')
            // 判断，如果当前页就剩下一条，应该让pagenum -1
            if (this.tableData.length === 1 && this.pagenum > 1) {
              this.pagenum--
            }
            this.getUserList()
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(() => {
          this.$message('操作取消')
        })
    },
    queryUser () {
      this.getUserList()
    },
    // 改变状态
    changestate (id, state) {
      this.axios.put(`users/${id}/state/${state}`).then(res => {
        const { status } = res.meta
        if (status === 200) {
          this.$message.success('修改成功')
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-breadcrumb {
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  background-color: #ddd;
}

.el-input {
  width: 300px;
}
</style>
