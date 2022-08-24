const path = require('path');

module.exports = {


     uploadDir: path.join(__dirname, '../public/uploads/'),

  
    isEmpty: function(obj){

        {
            if(obj && obj.file && obj.file.hasOwnProperty('size')){
                return false;
            }
        }

        return true;

    }
};