const path = require('path');

const injectAlias = (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    '~controls': path.resolve(__dirname, './src/controls'),
    '~docs': path.resolve(__dirname, './docs'),
    "@acme-ui/core": path.resolve(__dirname, "../../../core/src"), // 配置去获取源文件
    "@acme-ui/icons": path.resolve(__dirname, "../../../icons/src"),
  }

  return config;
}

module.exports = injectAlias;
