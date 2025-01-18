const MongoClient = require('mongodb').MongoClient;
const mongoConnectionString = "mongodb+srv://nowfalmmuhammed:PdskykeZrt1TPHBy@cluster0.ylmrd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const mongoLocalString = "mongodb://127.0.0.1:27017";

const state = {
    db : null
};

module.exports.connect = async (done)=>{
    if(state.db) return done();
    try{
        state.db = await MongoClient.connect(mongoConnectionString);
        done();
    }catch(err){
        done(err);
    }
};

module.exports.get = ()=>{
    return state.db;
};