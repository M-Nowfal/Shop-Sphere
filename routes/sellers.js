let express = require('express');
let router = express.Router();
let addDBData = require('../database-helper/add_db_info');
let getDBData = require('../database-helper/get_db_info');
let remDBData = require('../database-helper/remove_db_info');
let updateDBData = require('../database-helper/update_db_info');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('Sellers');
});

router.get('/sign-in', (req, res) => {
	res.render('seller/sellersignin', { seller: true });
});

router.get('/sign-out', (req, res) => {
	res.render('seller/sellersignout', { seller: true });
});
router.post('/sign-out', (req, res) => {
	getDBData.getSellerInfo(req.body, (response) => {
		if (response) {
			remDBData.removeSeller(response, (err) => {
				if (!err) {
					req.session.destroy();
					res.redirect('/');
				} else {
					res.render('message', { message: "Error Occured try again later", loginpage: true });
				}
			});
		}
	});
});

router.get('/login', async(req, res) => {
	if(req.session.seller){
		res.render('seller/sellerviewpage',
		{
			products: await getDBData.getProducts(),
			seller: true, loggedin: true,
			currentlogin: `${req.session.user.fname + " " + req.session.user.lname}`
		});
	}
	else
		res.render('seller/sellerlogin', { seller: true });
});
router.post('/log-in', (req, res) => {
	getDBData.getSellerInfo(req.body, async (response) => {
		if (response) {
			req.session.loggedIn = true;
			req.session.seller = true;
			req.session.user = { fname: response[0].fname, lname: response[0].lname, email: response[0].email, sellerid: response[0].sellerid };
			res.render('seller/sellerviewpage',
				{
					products: await getDBData.getProducts(),
					seller: true, loggedin: true,
					currentlogin: `${response[0].fname + " " + response[0].lname}`
				});
		} else {
			res.render('message', { message: "Seller Not Exist", loginpage: true });
		}
	});
});

router.get('/allorders', async(req,res)=>{
	let allorderedproducts = await getDBData.getAllOrders(req.session.user.sellerid);
	if(allorderedproducts){
		let address = await getDBData.getOrderAddress(allorderedproducts);
		let allproductsandaddress = [];
		let j = 0;
		for(let i of allorderedproducts){
			i["address"] = `${address[j].doorno+", "+address[j].street+", "+address[j].area+", "+address[j].city+", "+address[j].state+" "+address[j].pincode}`
			j++;
			allproductsandaddress.push(i);
		}
		res.render('seller/allorders',{allorders:allproductsandaddress, seller:true});
	}else{
		res.render('message', { message: "No Orders", loginpage: true });
	}
});

router.get('/log-out', (req, res) => {
	let user = null;
	if (req.session.loggedIn) {
		user = `${req.session.user.fname + " " + req.session.user.lname}`;
	}
	res.render('seller/sellerlog-out', { seller: true, currentlogin: user, loggedin: req.session.loggedIn });
});
router.post('/log-out', (req, res) => {
	getDBData.getSellerInfo(req.body, (response) => {
		if (response) {
			req.session.destroy();
			res.redirect('/');
		} else {
			res.render('message', { message: "Incorrect SellerID or password", loginpage: true, seller:true });
		}
	});
});


router.post('/signin', (req, res) => {
	addDBData.addSeller(req.body, (data) => {
		if (data != "Seller Already Exist") {
			req.session.seller = true;
			req.session.loggedIn = true;
			req.session.user = { fname: req.body.fname, lname: req.body.lname, email: req.body.email, sellerid: req.body.sellerid };
			res.redirect('/');
		} else {
			res.render('message', { message: "Seller Already Exist" });
		}
	});
});

router.get('/addproducts', (req, res) => {
	res.render('seller/addnewproducts');
});
router.post('/add-products', async (req, res) => {
	let img = req.files.image;
	let count = await getDBData.getCountOfProducts();
	let newproduct = await req.body;
	newproduct["no"] = ++count;
	await addDBData.addProducts(newproduct, async (err) => {
		if (!err) {
			const id = await getDBData.getID(count);
			img.mv('./public/images/product-images/' + id + '.jpg', async (err, done) => {
				if (!err) {
					await updateDBData.updateProductImage(count, id, (err) => {
						if (err) {
							console.log("Error", err);
						} else {
							res.render('message', { message: "Product Added", seller: true });
						}
					});
				} else {
					res.render('message', { message: err, loginpage: true });
				}
			});
		} else {
			res.render('message', { message: err, loginpage: true });
		}
	});
});

module.exports = router;