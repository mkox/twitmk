const assert = require('assert');
const app = require('../../src/app');

describe('\'sv_twitter7\' service', () => {
  it('registered the service', () => {
    const service = app.service('sv-twitter-7');

    assert.ok(service, 'Registered the service');
  });
});
