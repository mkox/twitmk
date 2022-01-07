const assert = require('assert');
const app = require('../../src/app');

describe('\'sv_twitter3\' service', () => {
  it('registered the service', () => {
    const service = app.service('sv-twitter-3');

    assert.ok(service, 'Registered the service');
  });
});
