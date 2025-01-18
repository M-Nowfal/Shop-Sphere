const MongoClient = require('mongodb').MongoClient;
const mongoLocalString = "mongodb://127.0.0.1:27017";

const state = {
    db : null
};

module.exports.connect = async (done)=>{
    if(state.db) return done();
    try{
        state.db = await MongoClient.connect(mongoLocalString);
        done();
    }catch(err){
        done(err);
    }
};

module.exports.get = ()=>{
    return state.db;
};
