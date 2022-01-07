const assert = require('assert');
const app = require('../../src/app');

describe('\'followed\' service', () => {
  it('registered the service', () => {
    const service = app.service('followed');

    assert.ok(service, 'Registered the service');
  });
});
