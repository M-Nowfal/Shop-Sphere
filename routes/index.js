let express = require('express');
let router = express.Router();
let getDBData = require('../database-helper/get_db_info');

/* GET home page. */
router.get('/', async function (req, res, next) {
	try {
		let mobiles = await getDBData.getMobiles();
		let laptops = await getDBData.getLaptops();
		let clothes = await getDBData.getClothes();
		let others = await getDBData.getOtherProducts();
		let currentlogin = null;
		let loggedin = false;
		let seller = req.session.seller;
		if(seller){
			mobiles = mobiles.map(item => ({...item, seller:true}));
			laptops = laptops.map(item => ({...item, seller:true}));
			clothes = clothes.map(item => ({...item, seller:true}));
			others = others.map(item => ({...item, seller:true}));
		}
		if (req.session.loggedIn) {
			currentlogin = `${req.session.user.fname + " " + req.session.user.lname}`,
				loggedin = true;
		}
		res.render(
			'index',
			{
				title: 'Shop-Sphere',
				mobiles, laptops, clothes, others,
				currentlogin, loggedin, seller
			}
		);
	} catch (err) {
		console.log("Error", err);
	}
});

module.exports = router;