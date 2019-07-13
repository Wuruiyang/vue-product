<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin: 15px 0;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select" style="width: 300px">
        <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
      </el-input>
      <el-button
        style="margin-left: 30px;"
        type="success"
        @click="addDialogVisible = true"
        plain
      >添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
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
          <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(row)" circle></el-button>
          <el-button type="danger" @click="deleteuser(row.id)" icon="el-icon-delete" circle></el-button>
          <el-button type="success" round>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户的dialog -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的dialog -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px" status-icon>
        <el-form-item label="用户名">
          <!-- <el-input placeholder="请输入用户名" v-model="editForm.username"></el-input> -->
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
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
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '用户名长度必须是3-12位',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度必须是6-12位', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入有效的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入有效的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { meta, data } = await this.axios.get('users', {
        // 在params里面写需要传递的参数
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
        // 原本这里需要配置header: {Authorization: localStorage.getItem('token')}
      })
      if (meta.status === 200) {
        this.tableData = data.users
        this.total = data.total
      }
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
    async deleteuser (id) {
      try {
        const { meta } = await this.axios.delete(`users/${id}`)
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
      } catch (error) {
        this.$message('操作取消')
      }
    },
    queryUser () {
      this.getUserList()
    },
    async changestate (id, state) {
      const res = await this.axios.put(`users/${id}/state/${state}`)
      const { status, msg } = res.meta
      if (status === 200) {
        this.$message.success('修改成功')
        this.getUserList()
      } else {
        this.$message.error(msg)
      }
    },
    async addUser () {
      try {
        await this.$refs.addForm.validate()
        const res = await this.axios.post('users', this.addForm)
        const { status, msg } = res.meta
        if (status === 201) {
          this.$message.success('添加成功')
          this.$refs.addForm.resetFields()
          this.addDialogVisible = false
          // 跳转到最后面的一页
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(msg)
        }
      } catch (error) {
        return false
      }
    },
    async showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm = { ...row }
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        const { id, email, mobile } = this.editForm
        const res = await this.axios.put(`users/${id}`, { email, mobile })
        const { status, msg } = res.meta
        if (status === 200) {
          this.$message.success('修改成功')
          this.$refs.editForm.resetFields()
          this.editDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error(msg)
        }
      } catch (error) {
        return false
      }
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
</style>
