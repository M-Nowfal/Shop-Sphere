let client = require('../config/connection');
const dbinfo = require('../config/db_constants');

module.exports = {
    updateProductImage : async (n,value,callback)=>{
        try{
            await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).updateOne({no:n},{$set:{image:'/images/product-images/'+value+'.jpg'}});
            callback();
        }catch(err){
            callback(err);
        }
    }
}