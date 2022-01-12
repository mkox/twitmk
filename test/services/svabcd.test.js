const assert = require('assert');
const app = require('../../src/app');

describe('\'svabcd\' service', () => {
  it('registered the service', () => {
    const service = app.service('svabcd');

    assert.ok(service, 'Registered the service');
  });
});
