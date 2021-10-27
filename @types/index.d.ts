declare interface Window {
  insights?:{
    chrome?: {
      init?: Function,
      identifyApp?: Function,
      on?: Function,
      appAction?: Function
    }
  }
}
