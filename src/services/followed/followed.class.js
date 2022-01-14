const { Service } = require('feathers-mongoose');

const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAP75WQEAAAAAYRBldGF5JE3YbWYGGfN4nlrgJ0o%3DHjdeReX2X8IsseT6u0ex0SGbnUVxOsbJIphTukAdD8Vk3uZbiS');

exports.Followed = class Followed extends Service {
    async _storeTwitterUserFollowed (data, params) {
        try {     
            
            var idOfFollowedUser = data.text;
            console.log(idOfFollowedUser);
            var userFields = 'created_at,description,entities,location,pinned_tweet_id,profile_image_url,protected,public_metrics,url,verified,withheld';

            const followedUser = await client.v2.user(idOfFollowedUser, { 'user.fields': userFields });
            //this._create({twUserId: idOfFollowedUser, twUserName: followedUser.data.username, twUser: followedUser.data});
            var upsertItem = await this.options.Model.findOneAndUpdate({twUserId: users[i].id},{twUserId: idOfFollowedUser, twUserName: followedUser.data.username, twUser: followedUser.data},{upsert: true});
            upsertItem.save();
        } catch (err) {
            console.error(err.message)
        }
    }

    create(...args) {
        console.log('in followed service');
        console.log(...args);
        return this._storeTwitterUserFollowed(...args);
    }
};
