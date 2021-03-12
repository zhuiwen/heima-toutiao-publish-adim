/**
 * ESLint：代码规范校验工具的配置文件
 * 注意：该文件修改，必须重启项目才生效
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  // 自定义代码校验规范
  rules: {
    // 可以用来判定代码的运行环境，npm run serve ---> 启动开发模式
    // 将来代码开发好了要发布部署到线上：npm run build ---> 构建生产环境(发布环境)运行的代码
    // process.env.NODE_ENV有两种值
    // production: 生产环境
    // development: 开发环境
    // no-console：不允许代码中出现console.xxx之类的代码
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // no-debugger：不允许代码打断点调试
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 'off',
    'no-unused-vars': 'off'
  }
}
