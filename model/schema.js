const mongoose = require('mongoose');
const schema = mongoose.Schema;


const docSchema= new schema({
    data:{},
    type:String
});

module.exports=mongoose.model('docSchema',docSchema);
