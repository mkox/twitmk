const app = require('../../src/app');

describe('\'followed\' service', () => {
  it('registered the service', () => {
    const service = app.service('followed');
    expect(service).toBeTruthy();
  });
});