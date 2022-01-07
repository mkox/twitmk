/*

// Initializes the `sv_twitter2` service on path `/sv-twitter-2`
const { SvTwitter2 } = require('./sv_twitter2.class');
const createModel = require('../../models/sv_twitter2.model');
const hooks = require('./sv_twitter2.hooks');
*/
module.exports = function (app) {
/*
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sv-twitter-2', new SvTwitter2(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sv-twitter-2');

  service.hooks(hooks);
*/


  const mongoose = require('mongoose');
  /*
      mainmg1().catch(err => console.log(err));
      
      async function mainmg1() {
        await mongoose.connect('mongodb+srv://michael2:CYeWTLYZcY3e2354ds2@cluster0.kc53v.mongodb.net');
  
        const kittySchema = new mongoose.Schema({
          name: String
        });
  
        const Kitten = mongoose.model('Kitten', kittySchema);
  
        
  
        //const silence = new Kitten({ name: 'Silence' });
        //console.log(silence.name); // 'Silence'
  
        // NOTE: methods must be added to the schema before compiling it with mongoose.model()
        kittySchema.methods.speak = function speak() {
          const greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name";
          console.log(greeting);
        };
       
        const fluffy = new Kitten({ name: 'fluffy2b' });
  
        //fluffy.speak(); // "Meow name is fluffy"
  
        await fluffy.save();
        //fluffy.speak();
  
  
        const kittens = await Kitten.find();
        console.log(kittens);
  
      }
  */
};
