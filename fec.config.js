module.exports = {
  appUrl: process.env.BETA ? '/preview/application-pipeline' : '/application-pipeline',
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  /**
   * Change accordingly to your appname in package.json.
   * The `sassPrefix` attribute is only required if your `appname` includes the dash `-` characters.
   * If the dash character is present, you will have add a camelCase version of it to the sassPrefix.
   * If it does not contain the dash character, remove this configuration.
   */
  sassPrefix: '.hacCore, .hacDev',
  /**
   * Change to false after your app is registered in configuration files
   */
  interceptChromeConfig: false,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  _unstableHotReload: process.env.HOT === 'true',
};
