const { resolve } = require('path');
const packageInfo = require('../package.json');

module.exports = {
  pluginMetadata: {
    name: packageInfo.name,
    version: packageInfo.version,
    exposedModules: {
      AppEntry: resolve(__dirname, '../src/components/SamplesFlow.tsx'),
      ComponentListView: resolve(
        __dirname,
        '../src/components/ComponentListView/ComponentListView.tsx',
      ),
      SamplePage: resolve(__dirname, '../src/pages/SamplePage/SamplePage.tsx'),
      K8sPage: resolve(__dirname, '../src/pages/TestK8s.tsx'),
      Applications: resolve(__dirname, '../src/components/ApplicationListView/ApplicationList'),
      Create: resolve(__dirname, '../src/components/SamplesFlow'),
    },
  },
  extensions: [
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio',
        className: 'hacDev',
        exact: true,
        component: {
          $codeRef: 'AppEntry',
        },
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/applications',
        className: 'hacDev',
        exact: true,
        component: {
          $codeRef: 'Applications',
        },
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/create',
        className: 'hacDev',
        exact: true,
        component: {
          $codeRef: 'Create',
        },
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/components',
        className: 'hacDev',
        exact: true,
        component: {
          $codeRef: 'ComponentListView',
        },
      },
    },
    {
      type: 'console.page/route',
      properties: {
        className: 'hacDev',
        path: '/app-studio/sample-page',
        exact: true,
        component: {
          $codeRef: 'SamplePage',
        },
      },
    },
    {
      type: 'console.page/route',
      properties: {
        className: 'hacDev',
        path: '/app-studio/k8s-util',
        exact: true,
        component: {
          $codeRef: 'K8sPage',
        },
      },
    },
    {
      type: 'console.navigation/href',
      properties: {
        className: 'hacDev',
        href: '/app-studio',
        name: 'App studio',
      },
    },
    {
      type: 'console.navigation/href',
      properties: {
        className: 'hacDev',
        href: '/app-studio/k8s-util',
        name: 'Test k8s',
      },
    },
  ],
  sharedModules: {
    'react-router-dom': { singleton: true },
    '@openshift/dynamic-plugin-sdk-utils': { singleton: true, import: false },
  },
};
