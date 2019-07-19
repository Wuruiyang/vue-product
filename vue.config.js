/* 导出一个对象，优先级比webpack.config.js高 */
module.exports = {
  // 保存代码的时候，启用eslint校验格式
  lintOnSave: true,
  devServer: {
    // 自动打开浏览器
    open: true,
    // 端口
    // port: 3000
    // 配置反向代理
    proxy: {
      '/aaa': {
        target: 'http://localhost:8888/api/private/v1/',
        // 使用正则 替换/aaa为''
        pathRewrite: { '^/aaa': '' }
      }
    }
  },
  configureWebpack: {
    // 配置的是排除打包的选项
    externals: {
      // import Vue from 'vue'  默认去node_modules中去找到vue模块
      // vue: 排序的模块名   Vue：一个全局变量
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      moment: 'moment'
    }
  }
}
