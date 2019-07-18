<template>
  <div>
    <el-button type="primary" @click="showAdd">主要按钮</el-button>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="cat_id" border>
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot="{ row }">
          <span>{{ row.cat_deleted == true ? "无效" : "有效" }}</span>
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
    <!-- 添加分类的dialog -->
    <el-dialog title="添加分类" :visible.sync="addVisible" width="40%">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="请输入分类的名称" v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader v-model="addForm.cat_pid" :options="options" :props="props"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
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
      total: 0,
      rules: {
        cat_name: [
          {
            required: true,
            message: '分类不能为空',
            trggier: ['change', 'blur']
          }
        ]
      },
      addVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: [],
        cat_level: ''
      },
      options: [],
      props: {
        // cat_id 必须要用''包起来
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
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
    },
    async showAdd () {
      this.addVisible = true
      const res = await this.axios.get('categories?type=2')
      console.log(res)
      if (res.meta.status === 200) {
        this.options = res.data
      }
    },
    async addCate () {
      try {
        await this.$refs.addForm.validate()
        const res = await this.axios.post('categories', {
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_pid.length,
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0
        })
        // console.log(res)
        const { status, msg } = res.meta
        if (status === 200) {
          this.$message.success(msg)
          this.$refs.addForm.resetFields()
          this.addVisible = false
          this.getCategoryList()
        } else {
          this.$message.error(msg)
        }
      } catch {
        return false
      }
    }
  }
}
</script>

<style>
</style>
