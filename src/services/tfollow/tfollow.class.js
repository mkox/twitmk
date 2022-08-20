const { Service } = require('feathers-mongoose');

const { TwitterApi } = require('twitter-api-v2');

const config = require('config');
const client = new TwitterApi(config.get('twitterBearerToken'));

//const standardFollowerId = Service.app.get('standardFollowerId');
var standardFollowerId = config.get('standardFollowerId');
if(process.env.NODE_ENV === "test"){
  standardFollowerId = '111111';
}
console.log('x1 - standardFollowerId: ');
console.log(standardFollowerId);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.Tfollow = class Tfollow extends Service {
    
  async _getAndStoreTwitterUsers (data, params) {
        
    /*
              console.log('data:' + data);
              console.log('data.text:' + data.text);
              console.log('data.maxResults:' + data.maxResults);
              console.log('params.query:' + params.query);
              var quer = params.query;
              for (let x in quer) {
                console.log(quer[x]);
              } 
              console.log('params:' + params);
        */
    try {
      //var idOfFollowedUser = '56060605'; // @michaelkox
      //var idOfFollowedUser = '26044503'; // @attacd
      var idOfFollowedUser = data.text;

      console.log('idOfFollowedUser:' + idOfFollowedUser);
      var maxResults = data.maxResults;
      var paginationToken = '';
      var newPage = 1;
      var pageCounter = 0;
      var requestsLimit = 14; // https://developer.twitter.com/en/docs/twitter-api/rate-limits
      //var delayTotal = 0;
      //var delayAddition = 960000; // 16*60*1000 = 960000
      //var delay = 960000; // 16*60*1000 = 960000
      var delay = 900000; // 15*60*1000 = 960000
      var followersAsPaginator;
        
      var userFields = 'created_at,description,entities,location,pinned_tweet_id,profile_image_url,protected,public_metrics,url,verified,withheld';
      var userParams = { asPaginator: true, 'max_results': maxResults, 'user.fields': userFields};
      var users;
      var nextToken;
      //var upsertItem;
      var bulk;
      var bulk2;


      const date = new Date();  // at the start of this method
      var isoDate = date.toISOString();
            
      /*
            //console.log('this.app:');
            //console.log(this.app);
            console.log('this.options:');
            console.log(this.options);
            console.log('this.methods:');
            console.log(this.methods);
            //this.
            */
            
      do {
        pageCounter++;
                
        //if(pageCounter % requestsLimit == 1){
        //  if(pageCounter > 1) delayTotal+= delayAddition;
        //}
                
        if (paginationToken != '') {
          userParams.pagination_token = paginationToken;
        }
        if(pageCounter % requestsLimit == 1){
          if(pageCounter > 1) await sleep(delay);
        }
        followersAsPaginator = await client.v2.followers(idOfFollowedUser, userParams);
        //console.log(followersAsPaginator); 
        if(followersAsPaginator !== undefined 
                    && followersAsPaginator._realData !== undefined 
                    && followersAsPaginator._realData.meta !== undefined ){
          nextToken = followersAsPaginator._realData.meta.next_token;
        }
        if(nextToken !== undefined && newPage == 1){
          paginationToken = nextToken;
        } else if(nextToken == undefined && newPage == 1) {
          newPage = -1;
        } else {
          newPage = 0;
        }
        users = followersAsPaginator._realData.data;
        //console.log(users);

        bulk = [];
        for (let i = 0; i < users.length; i++) {
          //let bulkItem = {updateOne: {}};
          bulk.push(
            {
              updateOne: {
                filter: { twUserId: users[i].id },
                update: { twUserId: users[i].id, twUser: users[i], $addToSet: { followedIds: idOfFollowedUser } },
                //update: { twUserId: users[i].id, twUser: users[i], $addToSet: { followedIds: idOfFollowedUser }, 'standardFollower.isFollowing': 0 },
                upsert: true
              }
            }
          );
        }
        var bulkRes = await this.options.Model.bulkWrite(bulk);
        console.log('bulkRes.upsertedCount: ' + bulkRes.upsertedCount);
        console.log('bulkRes.modifiedCount: ' + bulkRes.modifiedCount);

        /* Only for 'standardFollower.isFollowing' */
        bulk2 = [];
        for (let i = 0; i < users.length; i++) {
          //let bulkItem = {updateOne: {}};
          bulk2.push(
            {
              updateOne: {
                filter: { twUserId: users[i].id, 'standardFollower.isFollowing': {$exists : false} },
                update: { $set: {'standardFollower.isFollowing': 0 } }
              }
            }
          );
        }
        var bulkRes2 = await this.options.Model.bulkWrite(bulk2);
        console.log('bulkRes.upsertedCount: ' + bulkRes2.upsertedCount);
        console.log('bulkRes.modifiedCount: ' + bulkRes2.modifiedCount);
                



        /*
                for (let i = 0; i < users.length; i++) {
                    //this._create({twUserId: users[i].id, twUser: users[i], followedIds: [idOfFollowedUser]});
                    upsertItem = await this.options.Model.findOneAndUpdate({twUserId: users[i].id},{twUserId: users[i].id, twUser: users[i], $addToSet: { followedIds: idOfFollowedUser }},{new: true, upsert: true});
                    //console.log('upsertItem: ');
                    //console.log(upsertItem);
                }
                */
        //newPage = 0; //here only for tests
      } while (newPage == 1);

      /* Remove unfollowed */
      var removeUnfollowed = {
        $and: [
          { followedIds: { $in: [ idOfFollowedUser ] }},
          { updatedAt: { $lt: isoDate }},
          { followedIds: { $size: 1 } }
        ]
      }
      await this.options.Model.deleteMany(removeUnfollowed);
      await this.options.Model.updateMany(
        { $and: [
          { followedIds: { $in: [ idOfFollowedUser ] }},
          { updatedAt: { $lt: isoDate }}
          ]
        },
        { $pull: { followedIds: idOfFollowedUser }}
        );
            
      const serviceFollowed = this.app.service('followed');
      serviceFollowed.create(data, params);
                   
    } catch (err) {
      console.error(err.message);
    }
            
  }

  async _getAndStoreFollowedByStandardUser () {
    try {
      //var standardFollowerId = this.app.get('standardFollowerId');
      //var standardFollowerId = '156561882';

      console.log('standardFollowerId:' + standardFollowerId);
      //var maxResults = data.maxResults;
      var maxResults = 1000;
      var paginationToken = '';
      var newPage = 1;
      var pageCounter = 0;
      var requestsLimit = 14; // https://developer.twitter.com/en/docs/twitter-api/rate-limits
            
      var delay = 900000; // 15*60*1000 = 960000
      var followingAsPaginator;
        
      var userFields = 'created_at,description,entities,location,pinned_tweet_id,profile_image_url,protected,public_metrics,url,verified,withheld';
      var userParams = { asPaginator: true, 'max_results': maxResults, 'user.fields': userFields};
      var users;
      var nextToken;
      //var upsertItem;
      var bulk;
      var bulkRemoveFollowing;
      var existingUser;
            
      do {
        pageCounter++;
                
        //if(pageCounter % requestsLimit == 1){
        //  if(pageCounter > 1) delayTotal+= delayAddition;
        //}
                
        if (paginationToken != '') {
          userParams.pagination_token = paginationToken;
        }
        if(pageCounter % requestsLimit == 1){
          if(pageCounter > 1) await sleep(delay);
        }
        console.log('fos 200');
        console.log('standardFollowerId: ');
        console.log(standardFollowerId);
        console.log('userParams: ');
        console.log(userParams);
        followingAsPaginator = await client.v2.following(standardFollowerId, userParams);
        //followingAsPaginator = await client.v2.following(standardFollowerId);
        console.log('fos 205');
        //console.log(followingAsPaginator); 
        if(followingAsPaginator !== undefined 
                    && followingAsPaginator._realData !== undefined 
                    && followingAsPaginator._realData.meta !== undefined ){
          nextToken = followingAsPaginator._realData.meta.next_token;
        }
        if(nextToken !== undefined && newPage == 1){
          paginationToken = nextToken;
        } else if(nextToken == undefined && newPage == 1) {
          newPage = -1;
        } else {
          newPage = 0;
        }
        users = followingAsPaginator._realData.data;
        //console.log(users);

        //this.app.
        var usersFollowedByStandardUser = await this._find({ query: { 'standardFollower.isFollowing' : { $eq: 1 }} });
        //console.log('usersFollowedByStandardUser: ');
        //console.log(usersFollowedByStandardUser);

        const date = new Date();
        let isoDate = date.toISOString();
        bulk = [];
        for (let i = 0; i < users.length; i++) {
          let isoDateFinal = isoDate;
          existingUser = usersFollowedByStandardUser.find(o => o.twUserId === users[i].id);
          //console.log('existingUser: ');
          //console.log(existingUser);
          if(typeof existingUser != 'undefined'){
            //console.log('x234');
            if(existingUser.standardFollower.followOnOrBefore.length == 24){
              //console.log('x234000000000000000');
              isoDateFinal = existingUser.standardFollower.followOnOrBefore;
            } 
            //else {
            //  console.log('existingUser.standardFollower.followOnOrBefore: ');
            //  console.log(existingUser.standardFollower.followOnOrBefore);
            //}
          } 
          //else {
          //  console.log('UNDEFINED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
          //}
          console.log('isoDateFinal: ');
          console.log(isoDateFinal);

          //let bulkItem = {updateOne: {}};
          bulk.push(
            {
              updateOne: {
                filter: { twUserId: users[i].id },
                //update: { twUserId: users[i].id, twUser: users[i], $addToSet: { 'standardFollower.followOnOrBefore': isoDate }, 'standardFollower.isFollowing': 1 },
                update: { twUserId: users[i].id, twUser: users[i], 'standardFollower.followOnOrBefore': isoDateFinal, 'standardFollower.isFollowing': 1  },
                upsert: true
              }
            }
          );
        }
        if(bulk.length > 0){
          var bulkRes = await this.options.Model.bulkWrite(bulk);
          console.log('bulkRes.upsertedCount: ' + bulkRes.upsertedCount);
          console.log('bulkRes.modifiedCount: ' + bulkRes.modifiedCount);
        }                

        bulkRemoveFollowing = [];
        for (let i = 0; i < usersFollowedByStandardUser.length; i++) {
          existingUser = users.find(o => o.id === usersFollowedByStandardUser[i].twUserId);

          if(typeof existingUser == 'undefined'){
            bulkRemoveFollowing.push(
              {
                updateOne: {
                  filter: { twUserId: usersFollowedByStandardUser[i].twUserId },
                  update: { 'standardFollower.isFollowing': 0  }
                }
              }
            );
          }
        }
        if(bulkRemoveFollowing.length > 0){
          var bulkRemoveFollowingRes = await this.options.Model.bulkWrite(bulkRemoveFollowing);
          console.log('bulkRemoveFollowingRes.upsertedCount: ' + bulkRemoveFollowingRes.upsertedCount);
          console.log('bulkRemoveFollowingRes.modifiedCount: ' + bulkRemoveFollowingRes.modifiedCount);
        }


      } while (newPage == 1);
                   
    } catch (err) {
      console.error(err.message);
    }
  }

  create(...args) {
    console.log('tfollow - x10');
    //console.log('args:');
    //console.log(args);
    //this.setup();
    //console.log('tfollow - x20');
    if(parseInt(args[0].createOption) === 1 ){
      return this._getAndStoreTwitterUsers(...args);
    } else if(parseInt(args[0].createOption) === 2 ){
      return this._getAndStoreFollowedByStandardUser();
    }
  }

  async _findRandomFollowers(params){
    var findResult;
    var followRatioResult = parseInt(params.query.followRatioNumerator) / parseInt(params.query.followRatioDenominator);
    //var standardFollowerId = this.app.get('standardFollowerId');
    //var isFollowingId;
    var isFollowingIds;
    var excludedFollowerId;
        
    console.log('find - params: ');
    console.log(params);

    console.log('params.query.followedUserId: ');
    console.log(params.query.followedUserId);

    console.log('find - x120');
    /*
        if(params.query.removeFollowedByStandardFollower === false){
            isFollowingId = 0;
        } else {
            isFollowingId = 1;
        }
        */
    excludedFollowerId = standardFollowerId;
    console.log('params.query.removeFollowedByStandardFollower: ' + params.query.removeFollowedByStandardFollower);
    if(params.query.removeFollowedByStandardFollower === false){
      isFollowingIds = [0,1];
      //console.log('find - x125');
      if(standardFollowerId == params.query.followedUserId) {
        //console.log('find - x126');
        excludedFollowerId = '0'; // so not removed through match $nin
        //console.log('excludedFollowerId: ' + excludedFollowerId);
      }
    } else {
      isFollowingIds = [0]; // so matched are only the not followed by standardFollower
    }
    //console.log('excludedFollowerId x127b: ' + excludedFollowerId);

    console.log('params.query.removeFollowingStandardFollower: ' + params.query.removeFollowingStandardFollower);
    if(params.query.removeFollowingStandardFollower === false){
      //console.log('find - x140');
      excludedFollowerId = '0';
    } else {
      excludedFollowerId = standardFollowerId;
    }

    if(params.query.followRatio === false){
      followRatioResult = 0;
    }
    //console.log('isFollowingId: ' + isFollowingId);
    console.log('isFollowingIds: ' + isFollowingIds);
    console.log('standardFollowerId: ' + standardFollowerId);
    console.log('followRatioResult: ' + followRatioResult);
    console.log('excludedFollowerId: ' + excludedFollowerId);
        
    findResult = await this.options.Model.aggregate([
      { $match : { followedIds: { $in: [ params.query.followedUserId ] } }},
      { $match : { followedIds: { $nin: [ excludedFollowerId ] } }},
      //{ $match : { 'standardFollower.isFollowing': isFollowingId} },
      { $match : { 'standardFollower.isFollowing': { $in: isFollowingIds }} },
      { $match : { 'twUser.public_metrics.followers_count': { $gte: parseInt(params.query.minimumOfFollowers) }} },
      { $addFields : { followRatio : { $divide: [ '$twUser.public_metrics.followers_count', '$twUser.public_metrics.following_count' ] } } },
      { $match : { followRatio: { $gte: followRatioResult }} },
      { $sample: { size: parseInt(params.query.numberOfUsers) } }
    ]);
        
    console.log('find - x150');
    console.log('findResult: ');
    console.log(findResult);
    return findResult;
  }

  async _getFollowedByDate(params){
    var findResult;

    const startDate = new Date(params.query.followingStartDate);
    let isoStartDate = startDate.toISOString();
    console.log('isoStartDate:');
    console.log(isoStartDate);

    const endDate = new Date(params.query.followingEndDate);
    let isoEndDate = endDate.toISOString();
    console.log('isoEndDate:');
    console.log(isoEndDate);
        
    console.log('find gFBD - params: ');
    console.log(params);

    console.log('find gFBD - x120');
        
    /*
        findResult = await this.options.Model.aggregate([
            { $match : { $and: [
                { 'standardFollower.isFollowing': 1}, 
                { 'tempDateStart': { $gte: [ 'standardFollower.followOnOrBefore', isoStartDate ] }},
                { 'tempDateEnd': { $lte: [ 'standardFollower.followOnOrBefore', isoEndDate ] }}
            ] } }
        ]);
        */
        
    findResult = await this.options.Model.aggregate([
      { $match : { 'standardFollower.isFollowing': 1} },
      { $match : { 'standardFollower.followOnOrBefore': { $gte: isoStartDate }} },
      { $match : { 'standardFollower.followOnOrBefore': { $lte: isoEndDate }} }
    ]);
        
    console.log('find gFBD - x130');
    console.log('findResult: ');
    console.log(findResult);
    return findResult;
  }

  find(...args){
    console.log('find - x100');
    //return this._findMain(...args);
    //console.log('args:');
    //console.log(args);

    if(parseInt(args[0].query.findOption) === 1 ){
      return this._findRandomFollowers(...args);
    } else if(parseInt(args[0].query.findOption) === 2 ){
      return this._getFollowedByDate(...args);
    } else {
      console.log('find - NO OPTION FITS!');
    }
  }
    
  setup(app) {
    //console.log('tfollow - x15');
    this.app = app;
    //console.log(this.app);
  }
    
};
