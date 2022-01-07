const assert = require('assert');
const app = require('../../src/app');

describe('\'sv_twitter4\' service', () => {
  it('registered the service', () => {
    const service = app.service('sv-twitter-4');

    assert.ok(service, 'Registered the service');
  });
});
