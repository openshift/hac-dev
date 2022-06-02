import { CreateApplicationPage } from "../support/pages/CreateApplicationPage";

export class Applications {
  static createApplication(name: string) {
    const createApplicationPage = new CreateApplicationPage();
    createApplicationPage.clickCreateApplication();
    createApplicationPage.setApplicationName(name);
    createApplicationPage.clickNext();
  }
}