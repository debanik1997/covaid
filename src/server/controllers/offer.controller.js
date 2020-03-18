const Offer = require('../models/offer.model');

exports.test = function (req, res) {
    res.send('Greetings from the offer controller!');
};

exports.offer_create = function (req, res) {
    // const user = req.currentUser;
    // Hard-coded for now
    const user_id = 123
    let offer = new Offer(
        {
            task: req.body.task,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            neighborhood_name: req.body.neighborhood_name,
            description: req.body.description,
            user_id: user_id
        }
    );
    offer.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Offer created successfully')
    })
};

exports.all_offers = function (req , res) {
    console.log("ALL");
    Offer.find({}).then(function (offers) {
        res.send(offers);
    });
};

exports.offer_details = function (req, res) {
    Offer.findById(req.params.id, function (err, offer) {
        if (err) return next(err);
        res.send(offer);
    })
};

exports.offer_update = function (req, res) {
    Offer.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, offer) {
        if (err) return next(err);
        res.send('Offer udpated.');
    });
};

exports.offer_delete = function (req, res) {
    Offer.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};