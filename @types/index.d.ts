declare module '*.svg' {
  const value: any;
  export = value;
}
declare interface Window {
  insights?: {
    chrome?: {
      init?: Function;
      identifyApp?: Function;
      on?: Function;
      appAction?: Function;
    };
  };
}
