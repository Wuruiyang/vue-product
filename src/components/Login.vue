<template>
  <div class="login">
    <!--
      el-form: 是一个表单页,
      :model  传入一个对象,让对象的属性和表单元素双向绑定
      label-width='80px'
      el-form-item: 每一行的表单元素
    -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
      <img src="../assets/avatar.jpg" />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登陆</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入axios
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        // require: 必须填写
        // message: 提示信息
        // trigger: 触发方式 change blur
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 7, message: '长度为3-6个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 14, message: '长度为6-14个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
    },
    login (form) {
      this.$refs.form.validate(isValid => {
        if (!isValid) {
          return false
        }
        this.axios.post('login', this.form).then(res => {
          // console.log(res.data)
          // 解构
          const {
            meta: { msg, status },
            data: { token }
          } = res
          if (status === 200) {
            this.$message({
              message: '登录成功',
              type: 'success',
              duration: 1000
            })
            // 存储token
            localStorage.setItem('token', token)
            // 跳转页面
            this.$router.push({ path: '/' })
          } else {
            // this.$message({
            //   message: msg,
            //   type: 'error'
            // })
            return this.$message.error(msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  overflow: hidden;
  height: 100%;
}
.el-form {
  width: 400px;
  background-color: #fff;
  margin: 200px auto;
  padding: 75px 40px 15px 40px;
  border-radius: 20px;
  box-sizing: border-box;
  position: relative;

  img {
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -66px;
    border: 8px solid #fff;
  }
}
html,
body {
  background-color: #ccc;
}
</style>
