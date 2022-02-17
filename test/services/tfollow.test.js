const assert = require('assert');
const app = require('../../src/app');

describe('\'tfollow\' service', () => {
  it('registered the service', () => {
    const service = app.service('tfollow');

    assert.ok(service, 'Registered the service');
  });
});
