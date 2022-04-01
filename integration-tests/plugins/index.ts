module.exports = (on, config) => {
  if (!config.env.hasOwnProperty('HAC_BASE_URL')) {
    config.env.HAC_BASE_URL = 'https://prod.foo.redhat.com:1337/beta/hac/app-studio';
  }
  if (!config.env.hasOwnProperty('USERNAME')) {
    config.env.USERNAME = 'testUser';
  }
  if (!config.env.hasOwnProperty('PASSWORD')) {
    config.env.PASSWORD = 'testPassword';
  }
  if (!config.env.hasOwnProperty('PR_CHECK')) {
    config.env.PR_CHECK = 'false';
  }
  return config;
};
