// tfollow-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'tfollow';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    twUserId: { type: String, required: true, index: true, unique: true},
    twUser: {},
    followedIds: [String],
    standardFollower: {},
    open: {}
  }, {
    timestamps: true
  });

  schema.index({ "$**": "text" }); // For searching in text fields.
  /**
  schema.index( // For searching in text fields.
    { 'twUser.location': 'text' },
    { 'twUser.description': 'text' },
    { 'twUser.name': 'text' },
    { 'twUser.username': 'text' }
  );
  */

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
  
};
