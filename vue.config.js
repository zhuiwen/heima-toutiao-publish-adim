module.exports = {
  devServer: {
    open: true, // 项目启动后自动在浏览器打开
    proxy: {
      '/mp': { // 拦截以/mp开头的请求
        host: 'localhost',
        port: 8080,
        target: 'http://api-toutiao-web.itheima.net',  // 跨域目标主机，自行修改
        ws: true,  // 代理 websockets
        changeOrigin: true // 是否开启跨域
      },
    }
  }
};