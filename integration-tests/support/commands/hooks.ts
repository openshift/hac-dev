import { Common } from '../../utils/Common';

before(() => {
  //Clear namespace before running the tests
  Common.cleanNamespace();
});

after(() => {
  //Clear namespace after running the tests
  Common.cleanNamespace();
});
