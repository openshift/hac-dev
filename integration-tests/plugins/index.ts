module.exports = (on, config) => {
  config.env.HAC_BASE_URL = 'https://prod.foo.redhat.com:1337/beta/hac/app-studio';
  if (!config.env.hasOwnProperty('USERNAME')) {
    config.env.USERNAME = 'testUser';
  }
  if (!config.env.hasOwnProperty('PASSWORD')) {
    config.env.PASSWORD = 'testPassword';
  }
  return config;
};
