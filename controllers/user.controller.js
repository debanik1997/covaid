// const Users = require('../models/user.model');
// const {GoogleSpreadsheet }= require('google-spreadsheet')
// const emailer =  require("../util/emailer");
const asyncWrapper = require("../util/asyncWrapper")
// var jwt = require('jwt-simple');
// const passport = require('passport');

const UserService = require('../services/user.service');

/**
 * Handle requests to register a user
 */
exports.handleRegisterRequest = asyncWrapper(async (req, res) => {
	const { body: { user } } = req;
    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
	}
	user.email = user.email.toLowerCase();

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    try {
		const new_user = await UserService.register_user(user);
        return (new_user._id === null) ? res.sendStatus(500) : res.status(201).send({'_id': new_user._id});
    } catch (e) {
		return res.status(422).send(e);
    }
});

/**
 * Handle requests to login
 */
exports.handleLoginRequest = asyncWrapper(async (req, res) => {
	const { body: { user } } = req;
    if(!user.email) {
		return res.status(422).json({
			errors: {
				email: 'is required',
			},
		});
    }
  
    if(!user.password) {
		return res.status(422).json({
			errors: {
				password: 'is required',
			},
		});
	}
	
	try {
		let result = await UserService.login_user(user);
		res.status(200).json(result)
    } catch (e) {
        return res.status(422).send({
			error: e.message
		});
	}
});

/**
 * Get current user who is logged in
 */
exports.handleGetCurrentUser = function (req, res) {
	const id = req.token.id;
	return UserService.get_user_by_id(id)
		.then((user) => {
			if (user.length === 0) {
				return res.sendStatus(400);
			}
			return res.json(user[0]);
		})
};

/**
 * Get all users given a query and a limit
 */
exports.handleGetUsers = asyncWrapper(async (req, res) => {

	const query = req.query;
	const limit = null;
	
	try {
		let users = await UserService.get_users(query, limit);
		return res.json(users);
	} catch (e) {
		return res.sendStatus(400);
	}
});

/**
 * Get all users given a latitude, longitude, and radius
 */
exports.handleGetUsersGivenLocation = asyncWrapper(async (req, res) => {
	const latitude = req.query.latitude;
	const longitude = req.query.longitude;
	const radius = req.query.radius;
	const limit = req.query.limit;
	try {
		let users = await UserService.get_users_with_location(latitude, longitude, radius, limit);
		return res.json(users);
	} catch (e) {
		return res.sendStatus(400);
	}
});

/**
 * Update any user-related information
 */
exports.handleUpdateInfo = asyncWrapper(async (req, res) => {
	const { body: { _id, updates } } = req;
	try {
		await UserService.update_user(_id, updates);
		return res.sendStatus(200);
	} catch (e) {
		console.log(e);
		return res.sendStatus(400);
	}
});














































// exports.register = function (req, res) {
//     const { body: { user } } = req;
//     if(!user.email) {
//         return res.status(422).json({
//         errors: {
//             email: 'is required',
//         },
//         });
//     }
    
//     validateEmailAccessibility(user.email).then(function(valid) {
//       if (valid) {
//           if(!user.password) {
//             return res.status(422).json({
//               errors: {
//                   password: 'is required',
//               },
//           });
//         }

//         const finalUser = new Users(user);
    
//         finalUser.setPassword(user.password);
//         finalUser.preVerified = false;
//         finalUser.verified = false;
//         finalUser.agreedToTerms = true;
//         finalUser.availability = true;
//         finalUser.notes = '';

//         finalUser.save(function(err, result) {
//           if (err) {
//             return res.status(422).send(err);
//           }

//           var userID = result._id;
//           if (user.association == "5e843ab29ad8d24834c8edbf") {
//             // PITT
//             addUserToSpreadsheet(finalUser, userID, '1l2kVGLjnk-XDywbhqCut8xkGjaGccwK8netaP3cyJR0')
//           } else if (user.association == "5e8439ad9ad8d24834c8edbe") {
//             // BALTI
//             addUserToSpreadsheet(finalUser, userID, '1N1uWTVLRbmuVIjpFACSK-8JsHJxewcyjqUssZWgRna4') 
//           }

//           var mode = "localhost:3000";
//           if (process.env.PROD) {
//               mode = "covaid.co"
//           }
    
//           var message = "http://" + mode + "/verify?ID=" + userID;

//           // if user association is baltimore, send google forms link
//           if (user.association == '5e8439ad9ad8d24834c8edbe') {
//             message = "https://forms.gle/aTxAbGVC49ff18R1A"
//           }

//           var data = {
//             //sender's and receiver's email
//             sender: "Covaid@covaid.co",
//             receiver: user.email,
//             link: message,
//             templateName: "verification",
//          };

//         emailer.sendVerificationEmail(data)

//         return (userID === null) ? res.sendStatus(500) : res.status(201).send({'id': userID});
//         });
//       } else {
//         return res.status(403).json({
//           errors: {
//               email: 'Already Exists',
//           },
//         });
//       }
//     });
// };

// exports.current = function (req, res) {
// 	const id = req.token.id;
  
// 	return Users.findById(id)
// 	  .then((user) => {
// 		if(!user) {
// 		  return res.sendStatus(400);
// 		}
  
// 		return res.json(user.toJSON());
// 	  });
//   };
  

// function validateEmailAccessibility(email){
//   return Users.findOne({email: email}).then(function(result){
//        return result === null;
//   });
// }

// exports.verify = function(req, res) {
//   Users.findByIdAndUpdate(req.query.ID, 
//       {"preVerified": true}, function(err, result){
//     if(err){
//         console.log("ERROR");
//         res.sendStatus(500);
//     }
//     else{
//         console.log("Success");
//         res.sendStatus(200);
//     }
//   })
// }

// exports.login = function (req, res, next) {
//     const { body: { user } } = req;
//     if(!user.email) {
//       return res.status(422).json({
//         errors: {
//           email: 'is required',
//         },
//       });
//     }
  
//     if(!user.password) {
//       return res.status(422).json({
//         errors: {
//           password: 'is required',
//         },
//       });
//     }
  
//     return passport.authenticate('userLocal', { session: false }, (err, passportUser, info) => {
//       if(err) {
//         return next(err);
//       }
  
//       if(passportUser) {
//         const user = passportUser;
//         if (passportUser.preVerified) {
//           user.token = passportUser.generateJWT();
//           return res.json({ user: user.toAuthJSON() });
//         } else {
//           return res.status(403).json({
//             errors: {
//               verifed: "unverifed",
//             },
//           });
//         }
//       } else {
//         return res.status(401).json({
//           errors: {
//             password: "incorrect",
//           },
//         });
//       }
//     })(req, res, next);
// };


// var rad = function(x) {
//   return x * Math.PI / 180;
// };

// function calcDistance(latA, longA, latB, longB) {
//   var R = 6378137; // Earth’s mean radius in meter
//   var dLat = rad(latB - latA);
//   var dLong = rad(longB - longA);
//   var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(rad(latA)) * Math.cos(rad(latB)) *
//     Math.sin(dLong / 2) * Math.sin(dLong / 2);
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   var d = R * c;
//   return d; // returns the distance in meter
// }

// async function updatePreVerified() {
//   await Users.updateMany({}, 
//     {'$set': {
//       'languages': ['English'],
//       'offer.car': false,
//       'offer.timesAvailable': [],
//       'association': '',
//       'association_name': '',
//       'agreedToTerms': true,
//       'verified': false
//       }
//     })
// }

// exports.set_notes = (req, res) => {
//   const user_id = req.body.user_id;
//   const note = req.body.note;
//   Users.findByIdAndUpdate(user_id, 
//       {$set: {
//           "note": note
//       }
//   }, function (err, request) {
//       if (err) return next(err);
//       res.send('User updated.');
//   });
// };

// exports.update_verify = (req, res) => {
//   const user_id = req.body.user_id;
//   const preVerified = req.body.preVerified;
//   Users.findByIdAndUpdate(user_id, 
//       {$set: {
//           "preVerified": preVerified
//       }
//   }, function (err, request) {
//       if (err) return next(err);
//       res.send('User updated.');
//   });
// };

// exports.all_users_of_an_association = function (req, res) {
//   var assoc = req.query.association;
//   if (assoc !== '5e88cf8a6ea53ef574d1b80c') {
//     Users.find({'association': assoc}).then(function (users) {
//       for (var i = 0; i < users.length; i++) {
//         const coords = users[i].location.coordinates;
//         const distance = calcDistance(req.query.latitude, req.query.longitude, coords[1], coords[0]);
//         users[i]['distance'] = distance;
//       }
//       users.sort(function(a, b){return a['distance'] - b['distance']});
//       res.send(users);
//     });
//     return;
//   } else {
//     if (req.query.latitude) {
//       Users.find({$or: [{'association': assoc}, {'association': ""}]}).then(function (users) {
//         for (var i = 0; i < users.length; i++) {
//           const coords = users[i].location.coordinates;
//           const distance = calcDistance(req.query.latitude, req.query.longitude, coords[1], coords[0]);
//           users[i]['distance'] = distance;
//         }
//         users.sort(function(a, b){return a['distance'] - b['distance']});
//         res.send(users);
//       });
//     } else {
//       Users.find({$or: [{'association': assoc}, {'association': ""}]}).then(function (users) {
//         res.send(users);
//       });
//     }
//   }
// }

// exports.find_user = function (req, res) {
//   var id = req.query.id;
//   Users.find({
//       '_id': id
//     }).then(function (user) {
//       res.send(user);
//   });
// }

// exports.all_users = function (req, res) {
//   Users.find({'availability': true,
//               'preVerified': true,
//               'location': 
//                 { $geoWithin: 
//                   { $centerSphere: 
//                     [[ req.query.longitude, req.query.latitude], 
//                       20 / 3963.2] 
//                   }
//                 }
//     }).then(function (users) {
//       for (var i = 0; i < users.length; i++) {
//         const coords = users[i].location.coordinates;
//         const distance = calcDistance(req.query.latitude, req.query.longitude, coords[1], coords[0]);
//         users[i]['distance'] = distance;
//       }
//       users.sort(function(a, b){return a['distance'] - b['distance']});
//       res.send(users);
//   });
// }

// exports.total_users = function (req, res) {
//   Users.find({}).count(function(err, count) {
//     res.send({'count': count});
//   })
// }

// exports.update = function (req, res) {
//   const id = req.token.id;

//   if (req.body.association == "5e843ab29ad8d24834c8edbf") {
//     // PITT
//     try {
//       updateUserInSpreadsheet(id, req.body, '1l2kVGLjnk-XDywbhqCut8xkGjaGccwK8netaP3cyJR0')
//     } catch (err) {
//       console.log(error)
//     }
//   }
  
//   Users.findByIdAndUpdate(id, {$set: req.body}, function (err, offer) {
//     if (err) return next(err);
    
//     res.send('User updated.');
//   });
// };

// exports.emailPasswordResetLink = asyncWrapper(async (req, res) => {
//   if (req.body.email !== undefined) {
//     var emailAddress = req.body.email;
//     Users.findOne({email: emailAddress}, function (err, user) {
//       if (err) {
//         return res.sendStatus(403)
//       }
//       const today = new Date();
//       const expirationDate = new Date(today);
//       expirationDate.setMinutes(today.getMinutes() + 5);
//       if (user) {
//         var payload = {
//           id: user._id,        // User ID from database
//           email: emailAddress,
//         };
//         var secret = user.hash;
//         var token = jwt.encode(payload, secret);
//         emailer.sendPasswordLink(emailAddress, payload.id, token);
//         res.sendStatus(200)
//       } else {
//         return res.status(403).send('No accounts with that email')
//       }
//     })
//   } else {
//     return res.status(422).send('Email address is missing.')
//   }
// });

// exports.verifyPasswordResetLink = asyncWrapper(async (req, res) => {
//   const user = await Users.findById(req.params.id)
//   var secret = user.hash;
//   try{
//     var payload = jwt.decode(req.params.token, secret);   
//     res.sendStatus(200)      
//   }catch(error){
//     console.log(error.message);
//     res.sendStatus(403);
//   }
// });

// exports.resetPassword = asyncWrapper(async (req, res) => {
//   var newPassword = req.body.newPassword
//   // update password
//   const user = await Users.findById(req.body.id)
//   user.setPassword(newPassword)
//   user.save(function(err, result) {
//     if (err) {    
//       return res.status(422).send(err);
//     } 
//     res.sendStatus(200)
//   })
// });

// exports.delete = function (req, res) {
//   Users.findByIdAndRemove(req.params.id, function (err) {
//       if (err) return next(err);
//       res.send('Successfully opted out!');
//   })
// };

// async function updateUserInSpreadsheet(id, updates, spreadsheetID) {
//   var creds;
//   if (process.env.GOOGLE_PRIVATE_KEY) {
//     const config = require("../config/client_secret").config
//     config["private_key"] = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
//     creds = JSON.parse(JSON.stringify(config))
//   } else {
//     creds = require('../config/client_secret.json')
//   }
//   const doc = new GoogleSpreadsheet(spreadsheetID);
//   await doc.useServiceAccountAuth({
//     client_email: creds.client_email,
//     private_key: creds.private_key,
//   });

//   await doc.loadInfo(); // loads document properties and worksheets

//   // create a sheet and set the header row
//   const volunterSheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]

//   const rows = await volunterSheet.getRows();
//   var updateRow;
//   for (i = 0; i < rows.length; i++) {
//     if (rows[i].ID == id) {
//       updateRow = rows[i];
//     }
//   }
//   updateRow.Neighborhood = updates.offer.neighborhoods.join(", ")
//   updateRow.Details = updates.offer.details
//   updateRow.Resource = updates.offer.tasks.join(", ")
//   updateRow.Car = updates.offer.car.toString()
//   updateRow.TimeOfAvailability = updates.offer.timesAvailable.join(", ")
//   updateRow.Languages = updates.languages.join(", ")
//   updateRow.Phone = updates.phone
//   updateRow.AvailabilityStatus = updates.availability.toString()

//   // console.log(updateRow)
//   await updateRow.save()
// }

// async function addUserToSpreadsheet(user, ID, spreadsheetID) {
//   var creds;
//   if (process.env.GOOGLE_PRIVATE_KEY) {
//     const config = require("../config/client_secret").config
//     config["private_key"] = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
//     creds = JSON.parse(JSON.stringify(config))
//   } else {
//     creds = require('../config/client_secret.json')
//   }
//   const doc = new GoogleSpreadsheet(spreadsheetID);
//   await doc.useServiceAccountAuth({
//     client_email: creds.client_email,
//     private_key: creds.private_key,
//   });

//   await doc.loadInfo(); // loads document properties and worksheets

//   // create a sheet and set the header row
//   const volunterSheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
  
//   // append rows 
//   await volunterSheet.addRow({ 
//     ID: ID,
//     Timestamp: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
//     AvailabilityStatus: user.availability.toString(),
//     Name: user.first_name + " " + user.last_name,
//     Email: user.email, 
//     Phone: user.phone,
//     Languages: user.languages.join(", "),
//     Agreement: true
//   });
// }