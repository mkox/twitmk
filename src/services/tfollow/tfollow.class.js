const { Service } = require('feathers-mongoose');

const { TwitterApi } = require('twitter-api-v2');

const config = require('config');
const client = new TwitterApi(config.get('twitterBearerToken'));

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
            
            const serviceFollowed = this.app.service('followed');
            serviceFollowed.create(data, params);
                   
        } catch (err) {
            console.error(err.message)
        }
            
    }

    async _getAndStoreFollowersOfStandardUser () {
        try {
            var standardFollowerId = this.app.get('standardFollowerId');
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
            var upsertItem;
            var bulk;
            
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
                    var existingUser = usersFollowedByStandardUser.find(o => o.twUserId === users[i].id);
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
                var bulkRes = await this.options.Model.bulkWrite(bulk);
                console.log('bulkRes.upsertedCount: ' + bulkRes.upsertedCount);
                console.log('bulkRes.modifiedCount: ' + bulkRes.modifiedCount);
            } while (newPage == 1);
                   
        } catch (err) {
            console.error(err.message)
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
            return this._getAndStoreFollowersOfStandardUser();
        }
    }

    async _findMain(params){
        var findResult;
        var followRatioResult = parseInt(params.query.followRatioNumerator) / parseInt(params.query.followRatioDenominator);
        var standardFollowerId = this.app.get('standardFollowerId');
        
        console.log('find - params: ');
        console.log(params);
        console.log('params.query.followedUserId: ');
        console.log(params.query.followedUserId);

        console.log('find - x120');
        
        if(params.query.removeFollowedByStandardFollower === false){
            standardFollowerId = '0';
        }
        if(params.query.followRatio === false){
            followRatioResult = 0;
        }
        
        findResult = await this.options.Model.aggregate([
            { $match : { followedIds: { $in: [ params.query.followedUserId ] } }},
            { $match : { followedIds: { $nin: [ standardFollowerId ] } }},
            { $match : { 'twUser.public_metrics.followers_count': { $gte: parseInt(params.query.minimumOfFollowers) }} },
            { $addFields : { followRatio : { $divide: [ '$twUser.public_metrics.followers_count', '$twUser.public_metrics.following_count' ] } } },
            { $match : { followRatio: { $gte: followRatioResult }} },
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
        //console.log('tfollow - x15');
        this.app = app;
        //console.log(this.app);
    }
    
};
