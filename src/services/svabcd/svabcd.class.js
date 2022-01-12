const { Service } = require('feathers-mongoose');

exports.Svabcd = class Svabcd extends Service {

    myfun(...args) {
        console.log('svabcd-myfun');
        console.log(...args);
    }

    /*
    create(...args) {
        console.log('svabcd-create');
        console.log(...args);
    }
    */
};
