'use strict';

module.exports = appInfo => {
  // console.log('appinfo====', appInfo)
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1534746625920_6651';

  // add your config here
  config.middleware = [];

  config.security = {
    // xframe: {
    //   enable: false,
    // },
    csrf: {
      enable: false
    },
  };

  // 日志路径
  config.logger = {
    consoleLevel: 'DEBUG',
    dir: `./opt/log/${appInfo.name}/logs`
  };

  return config;
};
