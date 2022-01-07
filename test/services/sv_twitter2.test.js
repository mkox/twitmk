const assert = require('assert');
const app = require('../../src/app');

describe('\'sv_twitter2\' service', () => {
  it('registered the service', () => {
    const service = app.service('sv-twitter-2');

    assert.ok(service, 'Registered the service');
  });
});
