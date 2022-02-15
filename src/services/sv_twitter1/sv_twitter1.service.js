// Initializes the `sv_twitter1` service on path `/sv-twitter-1`
const { SvTwitter1 } = require('./sv_twitter1.class');
const createModel = require('../../models/sv_twitter1.model');
const hooks = require('./sv_twitter1.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sv-twitter-1', new SvTwitter1(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sv-twitter-1');

  service.hooks(hooks);

  console.log('abc - service.js'); 
/*
  process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
  });
*/
  const { TwitterApi } = require('twitter-api-v2');

  const config = require('config');
  const client = new TwitterApi(config.get('twitterBearerToken'));
  
  const main = async () => {
    try {
      const followersOfJack = await client.v2.followers('56060605');
      /*console.log(followersOfJack);*/
      
      const followersOfJackAsPaginator = await client.v2.followers('56060605', { asPaginator: true });
      console.log(followersOfJackAsPaginator);
      service.create({text: JSON.stringify(followersOfJackAsPaginator)});
      /*
      console.log(followersOfJackAsPaginator instanceof UserFollowersV2Paginator) // true      
      */                   
    } catch (err) {
      console.error(err.message)
    }
  }
  
   main();

  /*
  try {
    main();
    } catch (e) {
      //console.log(e);
      throw new Error(e.message)
      console.log('dddd');
    }
    */


    /*
    const mongoose = require('mongoose');

    mainmg1().catch(err => console.log(err));
    
    async function mainmg1() {
      await mongoose.connect('mongodb+srv://michael2:CYeWTLYZcY3e2354ds2@cluster0.kc53v.mongodb.net');

      const kittySchema = new mongoose.Schema({
        name: String
      });


      //const silence = new Kitten({ name: 'Silence' });
      //console.log(silence.name); // 'Silence'

      // NOTE: methods must be added to the schema before compiling it with mongoose.model()
      kittySchema.methods.speak = function speak() {
        const greeting = this.name
          ? "Meow name is " + this.name
          : "I don't have a name";
        console.log(greeting);
      };

      const Kitten = mongoose.model('Kitten', kittySchema);
     
      const fluffy = new Kitten({ name: 'fluffy4' });

      //fluffy.speak(); // "Meow name is fluffy"

      await fluffy.save();
      //fluffy.speak();


      const kittens = await Kitten.find();
      console.log(kittens);

      

    }
*/
    


};
