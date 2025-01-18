let express = require('express');
let router = express.Router();
const getdbinfo = require('../database-helper/get_db_info');
const adddbinfo = require('../database-helper/add_db_info');
const remdbinfo = require('../database-helper/remove_db_info');


/* GET users listing. */

router.get('/', function (req, res, next) {
	res.render('/');
});

router.get('/log-in', async (req, res) => {
	if(req.session.loggedIn)
		res.redirect('/');
	else
		res.render('user/userlogin', { seller: false });
});

router.get('/log-out-page', (req, res) => {
	let user = null;
	if (req.session.loggedIn) {
		user = `${req.session.user.fname + " " + req.session.user.lname}`;
	}
	res.render('user/userlogout', { seller: false, currentlogin: user, loggedin: req.session.loggedIn });
});

router.post('/add-to-cart', (req, res) => {
	if (req.session.loggedIn) {
		adddbinfo.addToCart(req.session.user.email, req.body.cartno, (response) => {
			if (response != "Product Alrady Added in the Cart") {
				res.redirect('/');
			} else {
				res.redirect('/');
			}
		});
	} else {
		res.render('message', { message: "Login to Add products to Cart",loginpageuser:true });
	}
});

router.get('/cart', (req, res) => {
	if (req.session.loggedIn) {
		getdbinfo.getCartDetails(req.session.user.email, (cartItems) => {
			if (cartItems != "Empty") {
				cartproducts = cartItems;
				res.render('user/cartproducts', { cartproducts, currentlogin: `${req.session.user.fname + " " + req.session.user.lname}`, loggedin: req.session.loggedIn });
			} else {
				res.render('message', { message: "Empty Cart", currentlogin: `${req.session.user.fname + " " + req.session.user.lname}`, loggedin: req.session.loggedIn });
			}
		});
	} else {
		res.render('message', { message: "Login to see the Cart Products" });
	}
});

router.post('/removecartitem',(req,res)=>{
	remdbinfo.removeCartItem(req.body,(response)=>{
		if(response){
			res.render('message', { message: "Error Occured try Again", loginpageuser: true });
		}else{
			res.redirect('/users/cart');
		}
	});
});

router.post('/buyitem',async (req,res)=>{
	if(req.session.loggedIn){
		let productinfo = await getdbinfo.getSingleProduct(Number(req.body.buyno));
		res.render('user/productbuyconfirmation',{productinfo,total:productinfo.price+40});
	}else{
		res.render('message', { message: "Login to Order a Product", loginpageuser: true });
	}
});

router.post('/proceedtobuy',(req,res)=>{
	res.render('user/addressdetails',{productno:Number(req.body.buy), seller: false, currentlogin: `${req.session.user.fname+" "+req.session.user.lname}`, loggedin: req.session.loggedIn});
});

router.post('/placeorder',(req,res)=>{
	adddbinfo.addOrders(req.body,(respose)=>{
		if(respose != "Order Already Placed"){
			res.render('message', { message: "Order Placed", loginpageuser: false });
		}else{
			res.render('message', { message: respose, loginpageuser: false });
		}
	});
});

router.get('/my-orders',async(req,res)=>{
	if(req.session.loggedIn){
		let orderinfo = await getdbinfo.getOrderDetails(req.session.user.email);
		if(orderinfo)
			res.render('user/myorders',{orderinfo, fname: req.session.user.fname, lname: req.session.user.lname, email: req.session.user.email});
		else
			res.render('message', { message: "No Orders"});
	}else{
		res.render('message', { message: "Login to view Order Details", loginpageuser: true });
	}
});

router.post('/cancelorder',(req,res)=>{
	if(remdbinfo.removeOrder(req.body.cancelno)){
		res.redirect('/users/my-orders');
	}else{
		res.render('message', { message: "Error Occured try again later"});
	}
});

router.post('/log-out', (req, res) => {
	getdbinfo.getUserInfo(req.body, (response) => {
		if (response) {
			req.session.destroy();
			res.redirect('/');
		} else {
			res.render('message', { message: "Incorrect user name or password", loginpageuser: true });
		}
	});
});

router.post('/login', (req, res) => {
	if(req.session.loggedIn){
		res.redirect('/');
	}else{
		getdbinfo.getUserInfo(req.body, (userinfo) => {
			if (!userinfo) {
				res.render('message', { message: "No User data found", loginpageuser: true });
			} else {
				req.session.loggedIn = true;
				req.session.user = { fname: userinfo[0].fname, lname: userinfo[0].lname, email: userinfo[0].email };
				res.redirect('/');
			}
		});
	}
});

router.get('/sign-in', async (req, res) => {
	res.render('user/usersignin', { seller: false });
});

router.get('/sign-out', (req, res) => {
	res.render('user/usersignout', { seller: false });
});
router.post('/sign-out', (req, res) => {
	remdbinfo.removeUser(req.body,(response)=>{
		if(response === "Incorrect Password"){
			res.render('message', { message: response + " or Email"});
		}else{
			req.session.destroy();
			res.redirect('/');
		}
	});
});

router.post('/signin', (req, res) => {
	adddbinfo.addUser(req.body, (response) => {
		if (response != "User Already Exist") {
			req.session.loggedIn = true;
			req.session.user = { fname: req.body.fname, lname: req.body.lname, email: req.body.email };
			res.redirect('/');
		} else {
			res.render('message', { message: "User Already Exist try to Log in", loginpageuser: false });
		}
	});
});

module.exports = router;
