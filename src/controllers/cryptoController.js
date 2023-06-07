const router = require('express').Router();
const Crypto = require('../models/Crypto');

router.get('/create', (req, res) => {
    res.render('create');
});

router.post('/create', async (req, res) => {

    const {name, imageUrl, price, description, paymentMethod} = req.body;

    try {
        await Crypto.create({name, imageUrl, price, description, paymentMethod, owner: req.user._id});
    } catch (error) {
        return res.render('create', {error});
    }

    res.redirect('/');
});

router.get('/catalog', async (req, res) => {
    const cryptos = await Crypto.find().lean();

    res.render('catalog', {cryptos});
});

router.get('/:id/details', async (req, res) => {
    const crypto = await Crypto.findById(req.params.id).lean();

    if(!crypto) {
        return res.redirect('/404');
    }

    if(!req.user) {
        return res.render('details', {crypto});
    }

    const isOwner = crypto.owner == req.user._id;
    const isBought = crypto.purchasedBy.map(x => x.toString()).includes(req.user._id.toString());
    const isLogged = req.user;

    if(isOwner) {
        return res.render('details', {crypto, isOwner});
    }

    if(!isBought || isBought) {
        return res.render('details', {crypto, isBought, isLogged});
    }
});

router.get('/:id/buy', async (req, res) => {
    const crypto = await Crypto.findById(req.params.id);

    if(!crypto) {
        return res.redirect('/404');
    }

    crypto.purchasedBy.push(req.user._id);

    await crypto.save();

    res.redirect(`/crypto/${crypto._id}/details`);
});

router.get('/:id/delete', async (req, res) => {

    await Crypto.findByIdAndDelete(req.params.id);
    res.redirect('/crypto/catalog');
});

router.get('/:id/edit', async (req, res) => {
    const crypto = await Crypto.findById(req.params.id).lean();
    const isOwner = crypto.owner == req.user._id;
    const paymentMethods = [
        {name: 'crypto-wallet', isSelected: crypto.paymentMethod === 'crypto-wallet', description: 'Crypto Wallet'},
        {name: 'credit-card', isSelected: crypto.paymentMethod === 'credit-card', description: 'Credit Card'},
        {name: 'debit-card', isSelected: crypto.paymentMethod === 'debit-card', description: 'Debit Card'},
        {name: 'paypal', isSelected: crypto.paymentMethod === 'paypal', description: 'PayPal'},
    ]

    if(!crypto || !isOwner) {
        return res.redirect('/404');
    }

    res.render('edit', {crypto, paymentMethods});
});

router.post('/:id/edit', async (req, res) => {
    const {name, imageUrl, price, description, paymentMethod} = req.body;

    const crypto = await Crypto.findById(req.params.id);

    if(!crypto) {
        return res.redirect('/404');
    }

    crypto.name = name;
    crypto.imageUrl = imageUrl;
    crypto.price = price;
    crypto.description = description;
    crypto.paymentMethod = paymentMethod;

    await crypto.save();

    res.redirect(`/crypto/${crypto._id}/details`);
});



module.exports = router;