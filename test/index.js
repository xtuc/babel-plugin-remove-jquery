const chai = require("chai");
const {transformFileSync} = require("@babel/core");
const getFixtures = require("@babel/helper-fixtures").default;

const plugin = require('../src');
const fixtures = getFixtures("./test/fixtures");

fixtures.forEach((fixture) => {

  describe(fixture.title, () => {
    const tests = fixture.tests;

    tests.forEach((test) => {

      it(test.title, () => {
        const {actual, expect, options} = test;

        // Add our plugin
        options.plugins = [plugin];

        const actualOut = transformFileSync(actual.loc, options);

        chai
          .expect(actualOut.code)
          .to.be.equal(expect.code);
      });
    });
  });
});
