const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const shell = require("shelljs");
shell.echo(process.cwd());
shell.cp(process.cwd() + "/config/" + process.env.NULS_ENV + ".js", process.cwd() + "/src/config.js");
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {

  // 基本路径，如果是生产(也就是run build) 那么生成的 index.html 文件，引入的js，css路径前缀会是 /pocm/
  publicPath: process.env.NODE_ENV === 'production' ? '/pocm' : '/',
  //publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 输出文件目录
  outputDir: undefined,

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }));

    }
    config.externals = {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'moment': 'moment',
      'echarts': 'echarts',
      'element-ui': 'ELEMENT',
    }
  },
  baseUrl: undefined,
  //outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],

  css: {
    sourceMap: true
  },
  devServer: {
    port: 5086,
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    disableHostCheck: true,
    proxy: { // 配置跨域处理
      '/api': {
        target: 'https://pocm.nuls.io/api',
        changeOrigin: true,  // 是否跨域
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }

};
