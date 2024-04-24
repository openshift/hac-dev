import { NavItem } from '../support/constants/PageTitle';
import { DetailsTab } from '../support/pages/tabs/PipelinerunsTabPage';
import { Applications } from '../utils/Applications';
import { Common } from '../utils/Common';
import { UIhelper } from '../utils/UIhelper';

describe('Create Env using Non-OpenShift Cluster', () => {
  const applicationName = Common.generateAppName();
  const publicRepo = 'https://github.com/devfile-samples/devfile-sample-python-basic.git';
  const componentName: string = Common.generateAppName('python-basic');

  after(function () {
    Applications.deleteApplication(applicationName);
  });

  describe('Create an Application', () => {
    it('Create an Application with a component', () => {
      Common.navigateTo(NavItem.applications);
      Applications.createApplication();
      Applications.createComponent(publicRepo, componentName, applicationName);
    });

    it('Verify the Build Pipeline run details', () => {
      Applications.goToPipelinerunsTab();
      UIhelper.getTableRow('Pipeline run List', /Running|Pending/)
        .contains(`${componentName}-`)
        .invoke('text')
        .then((pipelinerunName) => {
          UIhelper.clickLink(pipelinerunName);
          DetailsTab.waitForPLRAndDownloadAllLogs();
        });
    });

    it('Verify Enterprise contract Test pipeline run Details', () => {
      Applications.clickBreadcrumbLink('Pipeline runs');
      UIhelper.clickRowCellInTable('Pipeline run List', 'Test', `${applicationName}-`);
      DetailsTab.waitForPLRAndDownloadAllLogs(false);
    });
  });
});
