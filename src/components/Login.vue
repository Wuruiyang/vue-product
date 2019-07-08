<template>
  <div class="login">
    <!--
      el-form: 是一个表单页,
      :model  传入一个对象,让对象的属性和表单元素双向绑定
      label-width='80px'
      el-form-item: 每一行的表单元素
    -->
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">登陆</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style>
.el-form {
  width: 400px;
  background-color: #fff;
  margin: 200px auto;
  padding: 75px 40px 15px 40px;
  border-radius: 20px;
}
</style>
