export const overviewTabPO = {
    clickTab: '[data-test="details__tabItem overview"]',
    goToComponents: '[data-test="go-to-components-tab"]',
    addComponent: '[data-test="add-component"]'
}

export const componentsTabPO = {
    clickTab: '[data-test="details__tabItem components"]',
    addComponent: '[data-test="add-component-button"]'
}

export const integrationTestsTabPO = {
    clickTab: '[data-test="details__tabItem integrationtests"]',
    inputFilter: '[data-test="name-input-filter"]',
    
}

export const actionsDropdown = {
    dropdown: '[data-test="details__actions"]',
    itemAddComponent: '[data-test="add-component"]',
    itemAddEnvironment: '[data-test="add-environment"]',
    itemAddIntegrationTest: '[data-test="add-integration-tests"]',
    itemDeleteApplication: '[data-test="delete-application"]',
    itemLearningResources: '[data-test="learning-resources"]'
}

export const createBuildStepPO = {
    mergePRButton: '[data-testid="merge-button"]',
    next: 'button[type=submit]',
}

export const addIntegrationStepPO = {
    displayNameInput: '[data-test="display-name-input"]',
    containerImageInput: '[data-test="container-image-input"]',
    pipelineNameInput: '[data-test="pipeline-name-input"]',
    optionalreleaseCheckbox: '[data-test="optional-release-checkbox"]',
    next: 'button[type=submit]',
}
