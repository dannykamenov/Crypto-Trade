const router = require('express').Router();
const Crypto = require('../models/Crypto');

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/404', (req, res) => {
    res.render('404');
});

router.get('/search', async (req, res) => {
    const cryptos = await Crypto.find().lean();
    res.render('search', {cryptos});
});

router.post('/search', async (req, res) => {
    const {name, paymentMethod} = req.body;
    const cryptos = await Crypto.find().lean();

    let filteredCryptos = cryptos.filter(x => x.name.toLowerCase().includes(name.toLowerCase()));

    if(paymentMethod) {
        filteredCryptos = filteredCryptos.filter(x => x.paymentMethod == paymentMethod);
    }

    res.render('search', {cryptos: filteredCryptos});
});

module.exports = router;