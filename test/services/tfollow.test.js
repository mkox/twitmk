const app = require('../../src/app');

describe('\'tfollow\' service', () => {
  it('registered the service', () => {
    const service = app.service('tfollow');
    expect(service).toBeTruthy();
  });
});