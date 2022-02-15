// Initializes the `sv_twitter3` service on path `/sv-twitter-3`
const { SvTwitter3 } = require('./sv_twitter3.class');
const createModel = require('../../models/sv_twitter3.model');
const hooks = require('./sv_twitter3.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sv-twitter-3', new SvTwitter3(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sv-twitter-3');

  service.hooks(hooks);

  const { TwitterApi } = require('twitter-api-v2');

  const config = require('config');
  const client = new TwitterApi(config.get('twitterBearerToken'));
  
  const main = async () => {
    try {
      //var idOfFollowedUser = '56060605'; // @michaelkox
      var idOfFollowedUser = '26044503'; // @attacd
      var maxResults = 1000;
      var paginationToken = '';
      var newPage = 1;
      var followersAsPaginator;
      /*
      const followersOfJack = await client.v2.followers('56060605');
      console.log(followersOfJack);
      */
      
      do {
        //const followersAsPaginator = await client.v2.followers(idOfFollowedUser, { asPaginator: true }, {'user.fields': 'created_at,description,entities,location,pinned_tweet_id,profile_image_url,protected,public_metrics,url,verified,withheld'});
        //const followersAsPaginator = await client.v2.followers(idOfFollowedUser, { asPaginator: true, 'max_results': maxResults, 'pagination_token': '', 'user.fields': 'created_at,description,entities,location,pinned_tweet_id,profile_image_url,protected,public_metrics,url,verified,withheld'});

        //console.log('paginationToken: ' + paginationToken);
        
        if (paginationToken == '') {
          //console.log('x10');
          followersAsPaginator = await client.v2.followers(idOfFollowedUser, { asPaginator: true, 'max_results': maxResults, 'user.fields': 'created_at,description,entities,location,pinned_tweet_id,profile_image_url,protected,public_metrics,url,verified,withheld'});
          //console.log(followersAsPaginator);
          //console.log('x12');
        } else {
          //console.log('x20');
          followersAsPaginator = await client.v2.followers(idOfFollowedUser, { asPaginator: true, 'max_results': maxResults, 'pagination_token': paginationToken, 'user.fields': 'created_at,description,entities,location,pinned_tweet_id,profile_image_url,protected,public_metrics,url,verified,withheld'});
        }
        

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
          //service.create({twUserId: users[i].id, twUser: users[i], followedIds: [idOfFollowedUser]});
        }
        //newPage = 0; //here only for tests
      } while (newPage == 1);

      //console.log(followersOfJackAsPaginator);
      //service.create({text: JSON.stringify(followersOfJackAsPaginator)});


                       
    } catch (err) {
      console.error(err.message)
    }
  }
  
   main();





};
