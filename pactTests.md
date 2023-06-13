# HAC-dev contract testing using Pact 
As HAC-dev is communicating with a lot of different components, we want to make sure that the API is valid. That's why we introduced contract tests to our repo. We're using the [Pact](https://docs.pact.io/) framework for our tests. This documentation is describing Pact tests in the context of HAC-dev and RHTAP. It is not going to the very details of a Pact functionality, so consider visiting the official Pact documentation. Once the tests are set up and running, we don't expect them to change often. They would be there mainly to raise our confidence that API is not broken in any way and notify us if some breaking change is coming.

## Table of content
  - [Overview](#overview)
    * [Benefits of contract tests](#benefits-of-contract-tests)
    * [Test flow](#test-flow)
  - [Implementation overview](#implementation-overview)
    * [Contract structure](#contract-structure)
    * [States](#states)
    * [When does the test run](#when-does-the-test-run)
    * [Gating](#gating)
    * [Pact broker](#pact-broker)
  - [Implementation details](#implementation-details)
    * [Test structure](#test-structure)
    * [Fields matchers](#fields-matchers)
    * [Pushing to Pact broker](#pushing-to-pact-broker)
  - [Adding new contract](#adding-new-contract)

## Overview
The main idea of contract testing is to ensure that the communication between two components is not broken. To do that, the consumer specifies the contract and the provider makes sure it's not breaking it with code changes.

In our case, HAC-dev is the only consumer so far. But several providers are talking with it (HAS, SPI...). In the future, it may be possible to add some other custom consumers and their contracts to the already existing ones.

### Benefits of contract tests
The advantage of those tests is that they run together with unit tests, which means:
- they are cheap on resources - they use the same setup as unit tests
- they are relatively fast, compared with the e2e tests
- they don't need both consumer and provider running during the verification
- the history is versioned and stored in one place

That said, we make sure that the API between components isn't broken with recent changes right after the developer makes a change locally - no need to wait for the complex and expensive tests (integration tests, e2e tests).

A developer making a change on a provider is ensured that an existing contract is still valid by simply running unit tests.

### Test flow
The consumer creates the contract, it specifies the request it sends and the expected fields it should get back in the response. For those fields, the consumer may specify just their type (e.g. field "id" is a "string"), exact data it should have for that particular request (e.g. "type" should be "Created"), or create a matcher (e.g. "date" should be in format "mm-dd-yyyy"). When the contract is created, the consumer pushes it to the Pact broker. 

Pact broker is an app, running on a cluster (cluster used for HAC-dev PR checks, maintained by HAC-dev QEs). It stores all contracts, their versions (from both the consumer and provider side), and verification results. Consumer pushes generated contracts to the Pact broker and the provider download contracts from there to verify them. 

The provider is not creating any contracts, it just makes sure that it's not breaking any existing ones. During verification on the provider side, the contracts are downloaded and verified. The status of the verification is sent back to the Pact broker. 

## Implementation overview
The tests are executed during different phases of a product lifecycle. They can be executed during unit tests or local development and can be also used as a gating during promotion to different environments.

### Contract structure
A contract is stored in a json file. The name of a contract has this structure: `<consumer>-<provider>.json`. It contains three parts - the example response with actual data, the matchers for the fields where some other matcher was used then the exact value of the field, and the metadata of the contract.

### States
Apart from the request and expected response, a contract also specifies a state. A state describes a setup of a system before the request is executed. This is a crucial part of a test and the main work for the dev/qe to properly define and implement the state. More information about the state can be found in the [official documentation](https://docs.pact.io/getting_started/provider_states).

Let's demonstrate that on the `Get application` test. The contract specifies the GET request (URL, body, etc.) and what the expected response is (e.g. body includes a `kind` field with the text value `Application`). The contract also specifies the state, which can be something like `App MyApp exists and has component MyComponent`. And the job is done for the consumer.

Now it's the provider's turn to interpret this state. In our example, the provider would have StateHandler defined with the description same as in the consumer and the actual code, that has to be done to fulfill this state. In the code, it can look like this:

```
pactTypes.StateHandlers{
        "App MyApp exists and has component MyComp": createAppAndComponents(myAppNamespace, "MyApp", "MyComp"),
    }
```

With the state and logic defined, Pact knows what to execute before that particular Pact verification.

### When does the test run
The tables below describe when the tests are running and what is tested/published. 

Consumer (HAC-dev):

| Event       | What is checked | Pushed to Pact broker | Implemented |
|-------------|-----------------|-----------------------|-------------|
| Locally running <br />`npm run pact` | Contract is generated, no verification is running | No | Yes  |
| PR update | Contract is generated, no verification is running | Yes<br /> commit SHA is a version<br />tagged by PR number |  Yes [job](https://prow.ci.openshift.org/job-history/gs/origin-ci-test/pr-logs/directory/pull-ci-openshift-hac-dev-main-pact) |
| PR merge | Contract is generated, no verification is running | Yes<br /> commit SHA is a version <br />tagged by branch "main"| Yes [job](https://prow.ci.openshift.org/job-history/gs/origin-ci-test/logs/branch-ci-openshift-hac-dev-main-pact-main) |

Provider:
| Event       | What is checked | Pushed to Pact broker | 
|-------------|-----------------|-----------------------|
| Locally as part of unit tests | Runs verification against <br />consumer "main" branch | No |
| PR update   | Runs verification against consumer  <br />"main" branch and all environments | No* | 
| PR merge | TBD | Yes<br />commit SHA is a version <br />tagged by branch "main" | 

\* The idea was to push also those tags, but for now, nothing is pushed as we don't have access to the secrets from this GH action.

### Gating
Pact tests should be also used as a gating during the promotion of a change to staging or production environments. Pact has a `can-i-deploy` functionality, that checks specified versions of consumer and provider and responds with the information, whether those changes are compatible or not. This part is not implemented yet.

### Pact broker
Pact broker is an application running on the cluster maintained by HAC-dev QEs. You can read more about it in [official documentation](https://docs.pact.io/pact_broker). If you want to know more about the actual setup, see the [HAC-dev QE infra-deployments fork documentation](https://github.com/redhat-hac-qe/infra-deployments/wiki).

## Implementation details
The rest of this documentation is dedicated to the implementation details of HAC-dev participant. If you're interested in seeing detailed information about implementation on providers, follow the appropriate link: [HAS](https://github.com/redhat-appstudio/application-service/blob/main/testPacts.md)

HAC-dev is a consumer, so in this repo, we generate the contracts, that are pushed to the Pact broker.

The tests are stored in the [`pact-tests`](https://github.com/openshift/hac-dev/tree/main/pact-tests) folder and end with `*.pact.spec.ts`. The rest of the files are test support.

The generated pacts are stored in the `pact/pacts` folder.

### Test structure
The whole test is wrapped in the `pactWith` function. It includes a jest-like test with the `provider.addInteraction()` method as follows:

```
await provider.addInteraction({
        state: `App ${app} exists and has component ${comp1} and ${comp2}`,
        uponReceiving: 'Get app with its components.',
        withRequest: {
          method: 'GET',
          path,
          headers: {
            'Content-type': 'application/json',
          },
        },
        willRespondWith: {
          status: 200,
          body: expectedResponse,
        },
      });
```
There is a specification for the interaction - the request, response, and state. The state has to match with one of the states defined by providers StateHandlers. 

To generate the contract, the test executes the method that calls the request and captured our expected response to the contract. HAC-dev is using `@openshift/dynamic-plugin-sdk-utils` for the request execution, so we have to mock its behavior. This is an additional step and is usually not required for Pact tests themselves. 

### Fields matchers
The consumer has to specify a field name that should be checked. There are several ways how to check this field's value. Let's take a short example of code and explain the different matchers used in HAC-dev tests. For more information, take a look at the [official documentation](https://docs.pact.io/implementation_guides/javascript/docs/matching).

```
const expectedResponse = {
    kind: ApplicationGroupVersionKind.kind,
    metadata: {
        creationTimestamp: term({
            generate: '2022-01-21T13:36:30Z',
            matcher: matchers.dateAndTime,
        }),
        generation: like(1),
        name: app,
    }
}
```

**The exact value** is checked when the value of a field is directly the value the response should return. In the example, the exact value check is done for the `kind` or `name` field.

**Like** matchers verifies that the value is `something like` the given one. In the example, the `generation` field is checked to have a value with an integer type. 

**Complex matchers** that require regex for verification are called `term`s. They have a `generate` field, that serves as an example data for the request. The `matcher` field then specifies the regex matcher. In our tests, the regex is kept separated in `matchers.ts` file.

The example code with given matchers will then generate this snippet in the contract file:

```
      "response": {
        "body": {
          "kind": "Application",
          "metadata": {
            "creationTimestamp": "2022-01-21T13:36:30Z",
            "generation": 1,
            "name": "myapp",
          }
        },
        "matchingRules": {
          "$.body.metadata.creationTimestamp": {
            "match": "regex",
            "regex": "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$"
          },
          "$.body.metadata.generation": {
            "match": "type"
          }
        }
```

### Pushing to Pact broker
Pushing to the Pact broker is done via [pact-broker CLI](https://github.com/pact-foundation/pact_broker-client), but you can also use `curl` if needed. To push the contract, you need to have a file with the contract, `-a` tag specifying a contract version, `-b` tag for the Pact broker URL, and `-u` and `-p` tag for username and password. If you need to push contracts there but don't have creds, ping `kfoniok`.

```
pact-broker publish \
    "$(pwd)/pact/pacts/HACdev-HAS.json" \
    -a ${SHA:0:7} \
    -b $PACT_BROKER_BASE_URL \
    -u $PACT_BROKER_USERNAME \
    -p $PACT_BROKER_PASSWORD
```

## Adding new contract
To add a new contract, create a new file in a `pact-tests` folder. In this test file, specify a request and response with appropriate matchers. Create a new interaction by the `provider.addInteraction()` method and specify a state. Mock any `@openshift/dynamic-plugin-sdk-utils` methods that are used during the test. Send a request by calling the appropriate function. Check the response at the end to make sure that the Pact returned the expected data. Run a new test locally by `npm run pact` to see if everything is running well. Once the test passes, you can check the contract file stored in the `pact/pacts` folder. Then you can create a PR and see the job passing also there. If you have any problems, reach out to kfoniok.