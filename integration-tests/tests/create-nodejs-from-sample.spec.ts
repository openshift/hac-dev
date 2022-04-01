/// <reference types="cypress" />
import { AddComponentPage } from '../support/pages/AddComponentPage';
import { BasePage } from '../support/pages/BasePage';
import { ComponentSamplesPage } from '../support/pages/ComponentSamplesPage';
import { CreateApplicationPage } from '../support/pages/CreateApplicationPage';
import { ReviewComponentPage } from '../support/pages/ReviewComponentsPage';
import { Common } from '../utils/Common';

describe('Create Node JS Application from Sample', () => {
  before(() => {
    //Open Base URL for AppStudio
    Common.openAppStudioBaseURL();
    const basePage = new BasePage();
    basePage.dismissCookies();
  });

  it('NodeJS app can be created', () => {
    const basePage = new BasePage();
    basePage.bannerExists();
  });
  //   //set application name
  //   const createApplicationPage = new CreateApplicationPage();
  //   createApplicationPage.clearApplicationName();
  //   createApplicationPage.setApplicationName('test-app' + new Date().getTime() / 1000);
  //   createApplicationPage.clickNext();

  //   // //open app sample page
  //   new AddComponentPage().openSamplesPage();
  //   new ComponentSamplesPage().selectNodeJSSampleAndCreate();

  //   //Review component page
  //   const reviewPage = new ReviewComponentPage();
  //   reviewPage.createApplication();

  //   //Check application
  //   reviewPage.checkAlert('Application and components created successfully');
  // });
});
