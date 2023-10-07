console.log("Inside tripsList controller");

const mongoose = require('mongoose');
const model = mongoose.model('trips');

//GET: /trips - lists all the trips
const tripsList = async (req, res) => {
    try {
        let trips = await model.find({});
        
        if (!trips) {
            return res.status(404).json({"message": "trip not found"});
        } else {
            return res.status(200).json(trips);
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};


//GET /trips/:tripCode - returns a single trip

const tripsFindByCode = async (req, res) => {
    model
        .find({'code': req.params.tripCode})
        .exec ((err, trip) => {
            if (!trip) {
                return res
                    .status(404)
                    .json({'message' : 'trip not found'});
            } else if (err) {
                return res
                    .status(404)
                    .json(err);
            } else {
                return res
                    .status(200)
                    .json(trip);
            }
        });
};

module.exports = {
    tripsList,
    tripsFindByCode
};