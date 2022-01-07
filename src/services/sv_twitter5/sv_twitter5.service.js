// Initializes the `sv_twitter5` service on path `/sv-twitter-5`
const { SvTwitter5 } = require('./sv_twitter5.class');
const createModel = require('../../models/sv_twitter5.model');
const hooks = require('./sv_twitter5.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sv-twitter-5', new SvTwitter5(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sv-twitter-5');

  service.hooks(hooks);

  const { TwitterApi } = require('twitter-api-v2');

  const client = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAP75WQEAAAAAYRBldGF5JE3YbWYGGfN4nlrgJ0o%3DHjdeReX2X8IsseT6u0ex0SGbnUVxOsbJIphTukAdD8Vk3uZbiS');
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const main = async () => {
    try {
      var idOfFollowedUser = '56060605'; // @michaelkox
      //var idOfFollowedUser = '26044503'; // @attacd
      var maxResults = 10;
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
      
      do {
        pageCounter++;
        /*
        if(pageCounter % requestsLimit == 1){
          if(pageCounter > 1) delayTotal+= delayAddition;
        }
        */
        if (paginationToken != '') {
          userParams.pagination_token = paginationToken;
        }
        if(pageCounter % requestsLimit == 1){
          if(pageCounter > 1) await sleep(delay);
        }
        followersAsPaginator = await client.v2.followers(idOfFollowedUser, userParams);
        
        var nextToken = followersAsPaginator._realData.meta.next_token;
        if(nextToken !== undefined && newPage == 1){
          paginationToken = nextToken;
        } else if(nextToken == undefined && newPage == 1) {
          newPage = -1;
        } else {
          newPage = 0;
        }
        console.log(followersAsPaginator);
        users = followersAsPaginator._realData.data;
        //console.log(users);

        for (let i = 0; i < users.length; i++) {
          service.create({twUserId: users[i].id, twUser: users[i], followedIds: [idOfFollowedUser]});
        }
        //newPage = 0; //here only for tests
      } while (newPage == 1);

      //console.log(followersOfJackAsPaginator);
      //service.create({text: JSON.stringify(followersOfJackAsPaginator)});

      // get infos of followed user
      const serviceFollowed = app.service('followed');
      const followedUser = await client.v2.user(idOfFollowedUser, { 'user.fields': userFields }); // 14 calls + 1 = 15
      //console.log(followedUser);
      serviceFollowed.create({twUserId: idOfFollowedUser, twUserName: followedUser.data.username, twUser: followedUser.data});
      // Before ".create": find out, of user already exists in collection.
      // Create transaction
                       
    } catch (err) {
      console.error(err.message)
    }
  }
  
   main();
};
