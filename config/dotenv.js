const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

/**
 * Setup, and access, a dotenv file and the related set of parameters.
 *
 * @param {string} configPath
 * @returns {*}
 */
const setupDotenvFile = (configPath) => {
  const dotenvInitial = dotenv.config({ path: configPath });
  dotenvExpand(dotenvInitial);
};

/**
 * Setup and access local and specific dotenv file parameters.
 *
 */
const setupDotenvFiles = () => {
  const RELATIVE_DIRNAME = path.resolve(__dirname, '.');

  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env.local'));
  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env'));

  const REGISTRATION_URL = process.env.REGISTRATION_URL;
  const PROXY_URL = process.env.PROXY_URL;
  const PROXY_WEBSOCKET_URL = process.env.PROXY_WEBSOCKET_URL;
  const WORKSPACE_ENDPOINT_URL = process.env.WORKSPACE_ENDPOINT_URL;

  process.env._REGISTRATION_URL = REGISTRATION_URL;
  process.env._PROXY_URL = PROXY_URL;
  process.env._PROXY_WEBSOCKET_URL = PROXY_WEBSOCKET_URL;
  process.env._WORKSPACE_ENDPOINT_URL = WORKSPACE_ENDPOINT_URL;
};

module.exports = { setupDotenvFiles };
