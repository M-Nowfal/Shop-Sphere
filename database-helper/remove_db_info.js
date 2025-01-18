const client = require('../config/connection');
const dbinfo = require('../config/db_constants');
const bcrypt = require('bcrypt');

module.exports = {
    removeProducts: async (productinfo,callback) => {
        try {
            await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).deleteOne(productinfo);
            callback();
        } catch (err) {
            callback(err);
        }
    },

    removeUser: async (userdetails,callback) => {
        try {
            let userinfo = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.USER_COLLECTION).find({email:userdetails.email}).toArray();
            if(await bcrypt.compare(userdetails.password,userinfo[0].password)){
                await client.get().db(dbinfo.DB_NAME).collection(dbinfo.USER_COLLECTION).deleteOne({email:userdetails.email});
                callback();
            }else{
                callback("Incorrect Password");
            }
        } catch (err) {
            callback(err);
        }
    },

    removeSeller: async (sellerdetails,callback) => {
        try {
            await client.get().db(dbinfo.DB_NAME).collection(dbinfo.SELLER_COLLECTION).deleteOne({email:sellerdetails.email});
            callback();
        } catch (err) {
            callback(err);
        }
    },

    removeCartItem: async (n,callback)=>{
        try{
            await client.get().db(dbinfo.DB_NAME).collection(dbinfo.CART).deleteOne({no:Number(n.removeno)});
            callback();
        }catch(err){
            callback(err);
        }
    },
    removeOrder: async (n)=>{
        try{
            await client.get().db(dbinfo.DB_NAME).collection(dbinfo.ORDER_COLLECTION).deleteOne({pno:n});
            return true;
        }catch(err){
            return false;
        }
    }
};
