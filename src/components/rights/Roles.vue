<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" @click="showAddDialog">添加角色</el-button>
    <el-table :data="rolesData" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <el-row v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag @close="delRoles(row, l1.id)" closable>{{ l1.authName }}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4" :gutter="20">
                  <el-tag @close="delRoles(row, l2.id)" type="success" closable>{{ l2.authName }}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="delRoles(row, l3.id)"
                    v-for="l3 in l2.children"
                    :key="l3.id"
                    closable
                  >{{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
            <el-divider></el-divider>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            circle
            size="small"
            @click="showEditDialog(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            circle
            size="small"
            @click="showDel(row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-edit"
            plain
            round
            size="small"
            @click="showAssign(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的提示框 -->
    <el-dialog title="角色授权" :visible.sync="assignVisible" width="40%">
      <el-tree
        :data="assignData"
        :props="assignProps"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assign">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除角色的提示框 -->
    <el-dialog title="温馨提示" :visible.sync="delVisible" width="40%">
      <span>你确定要删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUserRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色和修改角色合并的的dialog -->
    <el-dialog :title="title" :visible.sync="addVisible" width="40%">
      <el-form :model="addRoles" :rules="rules" ref="form">
        <el-form-item label="角色名称">
          <el-input v-model="addRoles.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoles.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getRolesList()
  },
  computed: {
    title () {
      return this.addRoles.roleId ? '修改角色' : '添加角色'
    }
  },
  data () {
    return {
      rolesData: [],
      assignVisible: false,
      delVisible: false,
      addVisible: false,
      assignData: [],
      assignProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addRoles: {
        roleName: '',
        roleDesc: '',
        roleId: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur'] }
        ]
      }
    }
  },
  methods: {
    async getRolesList () {
      const { data, meta } = await this.axios.get('roles')
      if (meta.status === 200) {
        // console.log(data)
        this.rolesData = data
      }
    },
    async delRoles (row, smallId) {
      const res = await this.axios.delete(`roles/${row.id}/rights/${smallId}`)
      console.log(res)
      const { data, meta } = res
      if (meta.status === 200) {
        console.log(data)
        this.$message.success(meta.msg)
        row.children = data
      }
    },
    async showAssign (row) {
      this.assignVisible = true
      // console.log(row)
      const { data, meta } = await this.axios.get(`rights/tree`)
      this.roleId = row.id
      // console.log(data, meta)
      if (meta.status === 200) {
        this.assignData = data
      }
      let ids = []
      // 使用forEach一层一层找id
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    // 授权功能
    async assign () {
      let id = this.$refs.tree.getCheckedKeys()
      let halfId = this.$refs.tree.getHalfCheckedKeys()
      let ids = [...id, ...halfId].join()
      console.log(ids)
      console.log(this.roleId)
      const res = await this.axios.post(`roles/${this.roleId}/rights`, {
        // 传值需要{}, 格式是 rids: ids
        rids: ids
      })
      console.log(res)
      const { msg, status } = res.meta
      if (status === 200) {
        this.$message.success(msg)
        this.assignVisible = false
        this.getRolesList()
      }
    },
    showDel (id) {
      this.delVisible = true
      this.roleId = id
    },
    async delUserRoles () {
      const res = await this.axios.delete(`roles/${this.roleId}`)
      const { msg, status } = res.meta
      if (status === 200) {
        this.$message.success(msg)
        this.delVisible = false
        this.getRolesList()
      } else {
        this.$message.error(msg)
      }
    },
    showAddDialog () {
      this.addVisible = true
      this.addRoles.roleName = ''
      this.addRoles.roleDesc = ''
      this.addRoles.roleId = ''
    },
    showEditDialog (row) {
      this.addVisible = true
      console.log(row)
      // 回显信息
      this.addRoles.roleName = row.roleName
      this.addRoles.roleDesc = row.roleDesc
      this.addRoles.roleId = row.id
    },
    async addUserRoles () {
      try {
        await this.$refs.form.validate()

        const { roleId } = this.addRoles
        let method = roleId ? 'put' : 'post'
        let url = roleId ? `roles/${roleId}` : `roles`

        const res = await this.axios[method](url, this.addRoles)
        const { status, msg } = res.meta
        if (status >= 200) {
          this.$message.success(msg)
          this.addVisible = false
          this.$refs.form.resetFields()
          this.getRolesList()
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

<style lang="scss" scoped>
.roles {
  position: relative;
  .el-divider {
    position: absolute;
    left: 0;
    bottom: 0;
    margin: 0px;
  }
  .el-tag {
    margin: 7px;
  }
}
</style>
