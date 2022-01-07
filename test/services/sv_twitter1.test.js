const assert = require('assert');
const app = require('../../src/app');

describe('\'sv_twitter1\' service', () => {
  it('registered the service', () => {
    const service = app.service('sv-twitter-1');

    assert.ok(service, 'Registered the service');
  });
});
