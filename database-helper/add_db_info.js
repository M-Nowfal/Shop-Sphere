const client = require('../config/connection');
const dbinfo = require('../config/db_constants');
const bcrypt = require('bcrypt');
const getDBInfo = require('../database-helper/get_db_info');

module.exports = {
    addProducts: async (productinfo,callback)=>{
        try{
            await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).insertOne(productinfo);
            callback();
        }catch(err){
            callback(err);
        }
    },
    addUser: async (userdetails,callback)=>{
        try{
            let userData = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.USER_COLLECTION).find({email:userdetails.email}).toArray();
            if(userData.length>0  && userData[0].email === userdetails.email){
                callback("User Already Exist");
            }else{
                userdetails.password = await bcrypt.hash(userdetails.password,10);
                await client.get().db(dbinfo.DB_NAME).collection(dbinfo.USER_COLLECTION).insertOne(userdetails);
                callback();
            }
        }catch(err){
            console.log(err);
        }
    },
    addSeller: async (sellerdetails,callback)=>{
        try{
            let n = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.SELLER_COLLECTION).find({email:sellerdetails.email}).toArray();
            if(n.length > 0 && n[0].email === sellerdetails.email){
                callback("Seller Already Exist")
            }else{
                sellerdetails.password = await bcrypt.hash(sellerdetails.password,10);
                await client.get().db(dbinfo.DB_NAME).collection(dbinfo.SELLER_COLLECTION).insertOne(sellerdetails);
                callback();
            }
        }catch(err){
            console.log(err);
        }
    },
    addToCart : async (useremail,productno,callback)=>{
        try{
            let n = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.CART).find({email:useremail,no:Number(productno)}).toArray();
            if(n.length>0){
                callback("Product Alrady Added in the Cart");
            }else{
                let product = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).find({no:Number(productno)}).toArray();
                await client.get().db(dbinfo.DB_NAME).collection(dbinfo.CART).insertOne(
                    {
                        no:product[0].no,
                        title_name:product[0].title_name,
                        image : product[0].image,
                        description : product[0].description,
                        price : product[0].price,
                        sellerid : product[0].sellerid,
                        category : product[0].category,
                        email:useremail
                    }
                );
                callback();
            }
        }catch(err){
            console.log(err);
            callback();
        }
    },
    addOrders : async (productnowithaddress,callback)=>{
        try{
            let order = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.ORDER_COLLECTION).find({pno:productnowithaddress.pno,email:productnowithaddress.email}).toArray();
            if(order.length > 0 && order[0].email === productnowithaddress.email){
                callback("Order Already Placed");
            }else{
                await client.get().db(dbinfo.DB_NAME).collection(dbinfo.ORDER_COLLECTION).insertOne(productnowithaddress);
                callback();
            }
        }catch(err){
            console.log(err);
            callback(err);
        }
    }
};
