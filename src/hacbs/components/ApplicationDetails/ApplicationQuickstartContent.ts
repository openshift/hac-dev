export const applicationQuickstartContent = {
  apiVersion: 'console.openshift.io/v1',
  kind: 'QuickStarts',
  metadata: {
    name: 'hacbs-getting-started-app',
  },
  spec: {
    version: 1.0,
    displayName: `Getting started with an application`,
    durationMinutes: 15,
    description: `Getting started with an application.`,
    introduction: `You created an app and added a component to it. Good job!

To get started using your app, follow the steps in this quick start guide.`,
    tasks: [
      {
        title: `Add components and builds`,
        description: `
1. Go to the **Actions** dropdown and select "Add component".
2. Add the components you want included, then you will receive a PR to add the build pipeline to your code.
3. View the Pull Requests we have sent you by clicking on the **Merge Pull Requests** button. You will be directed to the Pull Requests list.
4. Customize this build pipeline according to your development needs.
5. Merge to the PR to add the build pipeline to your code.`,
      },
      {
        title: `Add integration test`,
        description: `Integration test is a pipeline with the goal to test each component individually and then once more together as one application.

Because every app is different, we leave it up to you to build the pipeline. Once it is ready, continue by adding the integration test through the interface. We will make sure it is integrated correctly within your application's CI/CD flow.
1. To add an integration test, go to the **Action** dropdown of your application and select "Add integration test".
2. In the URL line, add a URL to your integration test.
3. To ensure your app is only released when the test passes, mark the integration test as **Mandatory for Release**.`,
      },
      {
        title: `Manage environments`,
        description: `Now, we need to deploy your builds somewhere.
        Add a static environment, an environment available only on this workspace.
        This will be your development environment.
1. To add a static environment, go to the **Actions** dropdown of your application and select **Add environment**.
2. On the next page, select a static environment.
3. On the Create Static environment page, complete all the mandatory input.
4. Click **Create**.`,
      },
    ],
    conclusion: `All done, your factory is ready!

Next you would want to:

- Connect to a managed environment to release your app to
- Push some code, monitor its process

In case you get lost, this guide is available for you on the Application **Actions** dropdown.`,
  },
};
