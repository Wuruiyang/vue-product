<template>
  <el-container class="index">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        欢迎你,
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="active"
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-submenu v-for="manage in data" :index="manage.path" :key="manage.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{manage.authName}}</span>
            </template>
            <el-menu-item v-for="item in manage.children" :index="item.path" :key="item.id">
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 一些主要的组件 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  async created () {
    const { data, meta } = await this.axios.get('menus')
    // console.log(data)
    if (meta.status === 200) {
      this.data = data
    }
  },
  data () {
    return {
      data: []
    }
  },
  computed: {
    active () {
      return this.$route.path.slice(1)
    }
  },
  methods: {
    // this.$confirm('' , '', {...}).then().catch()
    // 参数1:提示信息 参数2:提示头 参数3{}  .then成功的回调函数,.catch失败的函数
    // 退出登录功能
    logout () {
      this.$confirm('你确定要退出登录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          // 清空token,跳转到login,提示已经退出登录
          localStorage.removeItem('token')
          this.$router.push('login')
          this.$message.success('已退出')
        })
        .catch(() => {
          this.$message('已取消')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
html {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.index {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    display: flex;
    .logo,
    .logout {
      width: 180px;
    }
    .logo {
      background: url('../assets/logo.png') no-repeat center center/contain;
    }
    .title {
      flex: 1;
      h1 {
        color: #fff;
        font-size: 30px;
        text-align: center;
        height: 60px;
        line-height: 60px;
      }
    }
    .logout {
      height: 60px;
      line-height: 60px;
      font-weight: 700;
      text-align: right;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #eaeef1;
  }
}
</style>
