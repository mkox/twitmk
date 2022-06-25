const app = require('../../src/app');

beforeAll( async () => {
  var bulk;
  var bulkFollowed;

  const fs = require('fs');
  //let rawdata = fs.readFileSync('../../data/test/tfollows-20220601.json');
  //let rawdata = fs.readFileSync(path.resolve(__dirname, '../../data/test/tfollows-20220601.json'));
  let rawdata = fs.readFileSync('data/test/tfollows-20220601-2.json');
  let users = JSON.parse(rawdata);
  console.log('users: ');
  console.log(users);

  bulk = [];
  for (let i = 0; i < users.length; i++) {
    bulk.push(
      {
        updateOne: {
          filter: { twUserId: users[i].twUserId },
          update: { twUserId: users[i].twUserId, followedIds:  users[i].followedIds, twUser: users[i].twUser, standardFollower: users[i].standardFollower},
          upsert: true
        }
      }
    );
  }
  if(bulk.length > 0){
    const service = app.service('tfollow');
    var bulkRes = await service.options.Model.bulkWrite(bulk);
    console.log('bulkRes.upsertedCount: ' + bulkRes.upsertedCount);
    console.log('bulkRes.modifiedCount: ' + bulkRes.modifiedCount);
  }  

  let rawdataFollowed = fs.readFileSync('data/test/followeds-20220616.json');
  let usersFollowed = JSON.parse(rawdataFollowed);
  console.log('usersFollowed: ');
  console.log(usersFollowed);

  bulkFollowed = [];
  for (let i = 0; i < usersFollowed.length; i++) {
    bulkFollowed.push(
      {
        updateOne: {
          filter: { twUserId: usersFollowed[i].twUserId },
          update: { twUserId: usersFollowed[i].twUserId, followedIds:  usersFollowed[i].followedIds, twUser: usersFollowed[i].twUser, twUserName: usersFollowed[i].twUserName},
          upsert: true
        }
      }
    );
  }
  if(bulkFollowed.length > 0){
    const serviceFollowed = app.service('followed');
    var bulkResFollowed = await serviceFollowed.options.Model.bulkWrite(bulkFollowed);
    console.log('bulkResFollowed.upsertedCount: ' + bulkResFollowed.upsertedCount);
    console.log('bulkResFollowed.modifiedCount: ' + bulkResFollowed.modifiedCount);
  }  

});

describe('\'tfollow\' service', () => {
  it('registered the service', () => {
    const service = app.service('tfollow');
    expect(service).toBeTruthy();
  });
});


test('Get user list to follow users: nothing checked', async () => {
  const service = app.service('tfollow');
  var findResult = await service.find({ 
    query: {
      followedUserId: '12345678',
      removeFollowedByStandardFollower: false,
      removeFollowingStandardFollower: false,
      minimumOfFollowers: 0,
      followRatio: false,
      numberOfUsers: 100,
      findOption: 1
    } 
  });
  console.log(findResult);
  console.log('findResult: ');
  console.log('findResult.length: ');
  console.log(findResult.length);
  expect(findResult.length).toBe(4);
});
