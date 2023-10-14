const mongoose = require('mongoose');
const Trips = require('../models/Trips');
const model = mongoose.model('trips');

//GET: get user
const getUser = (req, res, callback) => {
    if (req.payload && req.payload.email) {            
      User
        .findOne({ email : req.payload.email })         
        .exec((err, user) => {
          if (!user) {
            return res
              .status(404)
              .json({"message": "User not found"});
          } else if (err) {
            console.log(err);
            return res
              .status(404)
              .json(err);
           }
          callback(req, res, user.name);                
        });
    } else {
      return res
        .status(404)
        .json({"message": "User not found"});
    }
};

//GET: /trips - lists all the trips
const tripsList = async (req, res) => {
    try {
        let trips = await model.find({}).exec();
        if (!trips || trips.length === 0) {
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
    try {
        let trip = await model.find({'code': req.params.tripCode}).exec();

        if (!trip || trip.length === 0) {
            return res.status(404).json({'message' : 'trip not found'});
        } else {
            return res.status(200).json(trip);
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

//POST: /trips - adds a trip to the list of trips

const tripsAddTrip = async (req, res) => {
    getUser(req, res,
        (req, res) => {
            Trips
                .create({
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                },
                (err, trip) => {
                    if (err) {
                        return res
                            .status(400) //bad request
                            .json(err);
                    } else {
                        return res
                            .status(201) //created
                            .json(trip);
                    }
                });
            }
        );
}

const tripsUpdateTrip = async (req, res) => {
    getUser(req, res,
        (req, res) => {
            Trips
            .findOneAndUpdate({'code': req.params.tripCode },{
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
        },  { new: true })
        .then(trip => {
            if (!trip){
                return res
                    .status(404)
                    .send({
                        message: "Trip not found with code" + req.params.tripCode
                    });
            }
            res.send(trip);
        }) .catch(err => {
            if (err.kind === 'ObjectId'){
                return res
                    .status(404)
                    .send({
                        message: "Trip not found with code" +  req.params.tripCode
                    });
            }
            return res
                .status(500) //server error
                .json(err);
            });
        }
    ); 
}

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};