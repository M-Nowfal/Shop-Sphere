const client = require('../config/connection');
const dbinfo = require('../config/db_constants');
const bcrypt = require('bcrypt');

module.exports = {
    getProducts : async ()=>{
        try{
            const products = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).find().toArray();
            return products;
        }catch(err){
            return err
        }
    },
    getSingleProduct : async (n)=>{
        try{
            const product = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).find({no:n}).toArray();
            return product[0];
        }catch(err){
            return err;
        }
    },
    getMobiles : async ()=>{
        try{
            const mobiles = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).find({category:"Mobile"}).toArray();
            return mobiles;
        }catch(err){
            return err;
        }
    },
    getLaptops : async ()=>{
        try{
            const laptops = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).find({category:"Laptop"}).toArray();
            return laptops;
        }catch(err){
            return err;
        }
    },
    getClothes : async ()=>{
        try{
            const clothes = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).find({category:"Clothes"}).toArray();
            return clothes;
        }catch(err){
            return err;
        }
    },
    getOtherProducts : async ()=>{
        try{
            const otherproducts = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).find({category:{$nin:["Mobile","Laptop","Clothes"]}}).toArray();
            return otherproducts;
        }catch(err){
            return err
        }
    },
    getCountOfProducts : async ()=>{
        try{
            const count = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).countDocuments();
            return count;
        }catch(err){
            return err;
        }
    },
    getID : async (n)=>{
        try{
            const document = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).find({no:n}).toArray();
            return document[0]["_id"];
        }catch(err){
            console.log(err);
            return null;
        }
    },
    getUserInfo : async (userdetails,callback)=>{
        try{
            const userData = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.USER_COLLECTION).find({email:userdetails.email}).toArray();
            if(userData.length>0 && await bcrypt.compare(userdetails.password,userData[0].password)){
                callback(userData);
            }else{
                callback();
            }
        }catch(err){
            console.log("Err",err);
            callback();
        }
    },
    getSellerInfo : async (credential,callback)=>{
        try{
            let sellerData = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.SELLER_COLLECTION).find({email:credential.email}).toArray();
            if(sellerData.length>0 && await bcrypt.compare(credential.password,sellerData[0].password)){
                callback(sellerData);
            }else{
                callback();
            }
        }catch(err){
            console.log("Error in getSellerInfo:", err);
            callback();
        }
    },
    getCartDetails : async (useremail,callback)=>{
        try{
            let products = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.CART).find({email:useremail}).toArray();
            if(products.length>0){
                callback(products);
            }else{
                callback("Empty");
            }
        }catch(err){
            console.log(err);
            callback();
        }
    },
    getOrderDetails : async(useremail)=>{
        try{
            let order = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.ORDER_COLLECTION).find({email:useremail}).toArray();
            if(order.length > 0){
                let orderproduct = [];
                for(let item of order){
                    let product = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).find({no:Number(item.pno)}).toArray();
                    orderproduct.push(product[0]);
                }
                return orderproduct;
            }else{
                return null;
            }
        }catch(err){
            console.log(err);
            return null;
        }
    },
    getAllOrders: async (seller)=>{
        try{
            let orders = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.ORDER_COLLECTION).find().toArray();
            if(orders.length > 0){
                let products = [];
                for(let item of orders){
                    let p = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.PRODUCT_COLLECTION).find({no:Number(item.pno),sellerid:seller}).toArray();
                    products.push(p[0]);
                }
                return products;
            }else{
                return null;
            }
        }catch(err){
            console.log(err);
            return null;
        }
    },
    getOrderAddress: async(n)=>{
        try{
            let a = [];
            for(let address of n){
                let p = await client.get().db(dbinfo.DB_NAME).collection(dbinfo.ORDER_COLLECTION).find({pno:String(address.no)}).toArray();
                a.push(p[0]);
            } 
            return a;
        }catch(err){
            console.log(err);
            return null;
        }
    }
}