const assert = require('assert');
const app = require('../../src/app');

describe('\'sv_twitter5\' service', () => {
  it('registered the service', () => {
    const service = app.service('sv-twitter-5');

    assert.ok(service, 'Registered the service');
  });
});
