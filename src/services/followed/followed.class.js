const { Service } = require('feathers-mongoose');

const { TwitterApi } = require('twitter-api-v2');

const config = require('config');
const client = new TwitterApi(config.get('twitterBearerToken'));

exports.Followed = class Followed extends Service {
  //async _storeTwitterUserFollowed (data, params) {
  async _storeTwitterUserFollowed (data) {
    try {     
            
      var idOfFollowedUser = data.text;
      console.log('followed - idOfFollowedUser: ' + idOfFollowedUser);
      var userFields = 'created_at,description,entities,location,pinned_tweet_id,profile_image_url,protected,public_metrics,url,verified,withheld';

      const followedUser = await client.v2.user(idOfFollowedUser, { 'user.fields': userFields });
      //this._create({twUserId: idOfFollowedUser, twUserName: followedUser.data.username, twUser: followedUser.data});
      await this.options.Model.findOneAndUpdate({twUserId: idOfFollowedUser},{twUserId: idOfFollowedUser, twUserName: followedUser.data.username, twUser: followedUser.data},{upsert: true});
            
    } catch (err) {
      console.error(err.message);
    }
  }

  create(...args) {
    console.log('in followed service');
    console.log(...args);
    return this._storeTwitterUserFollowed(...args);
  }
};
