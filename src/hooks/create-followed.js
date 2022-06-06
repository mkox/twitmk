// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html



// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    console.log('in hook');
    //const { data } = context;
    //console.log('context: ');
    //console.log(context);

    context.app.services.followed.create(context.data);

    return context;
  };
};
