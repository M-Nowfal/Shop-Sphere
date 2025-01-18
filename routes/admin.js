let express = require('express');
let router = express.Router();

router.get('/',(req,res)=>{
    res.send("Admin");
});

router.get('/settings',(req,res)=>{
    res.render('settings',{loggedin:req.session.loggedIn,seller:req.session.seller});
});

module.exports = router;