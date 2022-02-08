const { Service } = require('feathers-mongoose');

const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAP75WQEAAAAAYRBldGF5JE3YbWYGGfN4nlrgJ0o%3DHjdeReX2X8IsseT6u0ex0SGbnUVxOsbJIphTukAdD8Vk3uZbiS');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.SvTwitter7 = class SvTwitter7 extends Service {
    
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
            var upsertItem;
            var bulk;
            
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
                                upsert: true
                            }
                        }
                    );
                }
                var bulkRes = await this.options.Model.bulkWrite(bulk);
                console.log('bulkRes.upsertedCount: ' + bulkRes.upsertedCount);
                console.log('bulkRes.modifiedCount: ' + bulkRes.modifiedCount);
        
                for (let i = 0; i < users.length; i++) {
                    //this._create({twUserId: users[i].id, twUser: users[i], followedIds: [idOfFollowedUser]});
                    upsertItem = await this.options.Model.findOneAndUpdate({twUserId: users[i].id},{twUserId: users[i].id, twUser: users[i], $addToSet: { followedIds: idOfFollowedUser }},{new: true, upsert: true});
                    //console.log('upsertItem: ');
                    //console.log(upsertItem);
                }
                //newPage = 0; //here only for tests
            } while (newPage == 1);
            
            const serviceFollowed = this.app.service('followed');
            serviceFollowed.create(data, params);
                   
        } catch (err) {
            console.error(err.message)
        }
            
    }

    create(...args) {
        console.log('sv_twitter7 - x10');
        //this.setup();
        //console.log('sv_twitter7 - x20');
        return this._getAndStoreTwitterUsers(...args);
    }

    async _findMain(params){
        var findResult;
        var followRatio = parseInt(params.query.followRatioNumerator) / parseInt(params.query.followRatioDenominator);

        console.log('find - params: ');
        console.log(params);
        console.log('params.query.followedUserId: ');
        console.log(params.query.followedUserId);

        console.log('find - x120');
        
        findResult = await this.options.Model.aggregate([
            { $match : { followedIds: { $in: [ params.query.followedUserId ] } }},
            { $match : { 'twUser.public_metrics.followers_count': { $gte: parseInt(params.query.minimumOfFollowers) }} },
            { $addFields : { followRatio : { $divide: [ '$twUser.public_metrics.followers_count', '$twUser.public_metrics.following_count' ] } } },
            { $match : { followRatio: { $gte: followRatio }} },
            { $sample: { size: parseInt(params.query.numberOfUsers) } }
        ]);
        
        console.log('find - x130');
        console.log('findResult: ');
        console.log(findResult);
        return findResult;
    }

    find(...args){
        console.log('find - x100');
        return this._findMain(...args);
    }
    
    setup(app) {
        //console.log('sv_twitter7 - x15');
        this.app = app;
        //console.log(this.app);
    }
    
};
