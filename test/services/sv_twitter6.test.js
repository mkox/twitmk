const assert = require('assert');
const app = require('../../src/app');

describe('\'sv_twitter6\' service', () => {
  it('registered the service', () => {
    const service = app.service('sv-twitter-6');

    assert.ok(service, 'Registered the service');
  });
});
