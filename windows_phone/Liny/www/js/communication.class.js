/**
 * @fileOverview Communication class description
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

/**
 * @constant
 */
var comm_server = 'http://ws.liny.info';

/**
 * @name User
 * @class
 * @memberOf Communication
 */
var CommunicationUser = function() {
	var _user;
	var _token;
}

/**
 * @function set user for server communications
 * @name set
 * @memberOf Communication.User
 */
CommunicationUser.prototype.set = function(user) {
	this._user = user;
}

/**
 * @function get user from server communications
 * @name get
 * @memberOf Communication.User
 */
function getObj(u, user) {
	if (u == undefined) {
		u = new User();
	}
	u.avatar = (user.avatar_url == '/avatars/medium/missing.png') ? '' : user.avatar_url;
	u.id = user.id;
	if (user.personality != undefined) {
		if (user.personality.job.length != 0) {
			u.personality.job = user.personality.job;	
		}
		if (user.personality.languages.length != 0) {
			u.personality.languages = user.personality.languages;	
		}
		if (user.personality.rate != null) {
			u.personality.rate = user.personality.rate;	
		}
		if (user.personality.relationship != null) {
			u.personality.relationship = user.personality.relationship;	
		}
		if (user.personality.studies != null) {
			u.personality.studies = user.personality.studies;	
		}
	}
	
	if (user.physique != undefined) {
		if (user.physique.rate != null) {
			u.personality.rate = user.personality.rate;	
		}
		if (user.physique.color != null) {
			u.personality.color = user.personality.color;	
		}
		if (user.physique.size != null) {
			u.personality.size = user.personality.size;	
		}
	}
	
	if (user.profile != undefined) {
		if (user.profile.birthdate != null) {
			u.profile.birthdate = user.profile.birthdate;	
		}
		if (user.profile.firstname != null) {
			u.profile.firstname = user.profile.firstname;	
		}
		if (user.profile.gender != null) {
			u.profile.gender = user.profile.gender == false ? 'woman' : 'man';	
		}
		if (user.profile.lastname != null) {
			u.profile.lastname = user.profile.lastname;	
		}
		if (user.profile.license != null) {
			u.profile.license = user.profile.license;	
		}
	}
	
	if (user.trustGauge != null) {
		u.trustGauge = user.trustGauge;
	}
	
	return u;
}

/**
 * @function connect user
 * @name Login
 * @memberOf Communication.User
 */
CommunicationUser.prototype.login = function(success, error) {
	var uri = '/login.json',
	u = this._user,
	to_post = {
		alias: u.alias,
		secret: u.secret
	},
	_success = function(jsonData) {
			this._token = jsonData.token;
			if (window.localStorage) {
				localStorage.setItem('token', jsonData.token);
				var user = getObj(this._user, jsonData.user);
				localStorage.setItem('user', JSON.stringify(user));
			}
			success();
	};
	ajax_post(uri, to_post, _success, error);
}

/**
 * @function connect user with facebook
 * @name Login
 * @memberOf Communication.User
 */
CommunicationUser.prototype.login_facebook = function(success, error) {
	var uri = '/login/facebook.json',
	u = this._user,
	to_post = {
		alias: u.id,
		secret: u.secret
	},
	_success = function(jsonData) {
			this._token = jsonData.token;
			if (window.localStorage) {
				localStorage.setItem('token', jsonData.token);
				localStorage.setItem('user', jsonData.user);
			}
			success();
	};
	ajax_post(uri, to_post, _success, error);
}

/**
 * @function login user
 * @name Ajax post
 * @memberOf Communication.User
 */
function ajax_post(uri, to_post, _success) {
	var _error = arguments[3],
			token = arguments[4];

	$.ajax({
	  type: 'POST',
	  url: comm_server + uri,
	  data: to_post,
	  dataType: 'json',
		beforeSend: function(xhrObj){
			if (token != undefined) {
				if ((this._token == undefined || this._token == null) && window.localStorage) {
					this._token = localStorage.getItem('token');
				}
		  	xhrObj.setRequestHeader("X‐Liny-Api‐Token", this._token);
			}
		},
	  success: _success,
	  error: function(e) {
		console.log(e);
			if (typeof debug != 'undefined' && debug) {
				console.log(e);
			}
			if (_error != undefined && _error != null) {
				_error();	
			}
		}
	});
}

/**
 * @function login user
 * @name Ajax get
 * @memberOf Communication.User
 */
function ajax_get(uri, _success) {
	var _error = arguments[2],
			token = arguments[3];
	
	$.ajax({
	  type: 'GET',
	  url: comm_server + uri,
		beforeSend: function(xhrObj){
			if (token != undefined) {
				if ((this._token == undefined || this._token == null) && window.localStorage) {
					this._token = localStorage.getItem('token');
				}
		  	xhrObj.setRequestHeader("X‐Liny-Api‐Token", this._token);
			}
		},
	  success: _success,
	  error: function(e) {
			if (typeof debug != 'undefined' && debug) {
				console.log(e);
			}
			if (_error != undefined && _error != null) {
				_error();	
			}
		}
	});
}

/**
 * @function get the location of a user based on ip address
 * @name getLocation_byIP
 * @memberOf Communication.User
 */
CommunicationUser.prototype.getLocation_byIP = function(success) {
	var error = arguments[1],
			uri = '/users/location_by_ip.json';
	ajax_get(uri, success, error);
}

/**
 * @function create a user
 * @name Create
 * @memberOf Communication.User
 */
CommunicationUser.prototype.create = function(success, error) {
	var u = this._user,
			uri = '/users.json',
			to_post = {
				user: {
				  email : u.email,
					password : u.password,
					profile : {
						firstname : u.profile.firstname,
						lastname : u.profile.lastname,
						age : 18, //u.profile.birthdate,
						gender : u.profile.gender == man ? 1 : 0
					}
				}
			};
			if (u.provider.service_type != '') {
				to_post['provider'] = {
					'service_type' : u.provider.service_type,
					'service_user_id' :  u.provider.service_user_id,
					'service_user_token' : u.provider.service_user_token
				};
			}
			var _success = function(jsonData) {
				this._token = jsonData.token;
				if (window.localStorage) {
					localStorage.setItem('token', jsonData.token);
				}
				success();
				//return jsonData.user;
		  };
	ajax_post(uri, to_post, _success, error);
}

/**
 * @function get all info on user
 * @name getFull
 * @memberOf Communication.User
 */
CommunicationUser.prototype.getProfile = function(success) {
	var uri = '/users/' + this._user.id + '/full.json',
			is_distant = arguments[1],
			error = arguments[2];
	
	if (is_distant) {
		ajax_get(uri, success, error);
	} else {
		ajax_get(uri, success, error, this._token);
	}
}

/**
 * @function update a user's personality infos
 * @name Update Personality
 * @memberOf Communication.User
 */
function update_personality(u, success) {
	var error = arguments[2], 
		uri = '/users/' + u.id + '/personality.json',
			to_post = {
				personality : {
					job : u.personality.job,
					languages : u.personality.languages,
					tobacco_rate: u.rate.tobacco,
					alcohol_rate: u.rate.alcohol,
					relationship_status: u.relationship.type
				}
			};
	ajax_post(uri, to_post, success, error, this._token);
}

/**
 * @function update a user
 * @name Update
 * @memberOf Communication.User
 */
CommunicationUser.prototype.update = function(success) {
	var error = arguments[1], 
			u = this._user,
			uri = '/users/' + u.id + '.json',
			to_post = {
				user: {
					email: u.email,
					profile: {
						firstname: u.profile.firstname,
						lastname: u.profile.lastname,
						age: u.profile.birthdate,
						gender: u.profile.gender == man ? 1 : 0,
						description: u.info
					}
				}
			};
	if (u.password != '') {
		to_post['user']['password'] = u.password
	}
	var _success = function() {
		update_personality(u, success);
	}
	
	ajax_post(uri, to_post, _success, error, this._token);
}

/**
* @function update a user's location
* @name updateLocation
* @memberOf Communication.User
*/
CommunicationUser.prototype.updateLocation = function(success) {
	var error = arguments[1],
			u = this._user,
			uri = '/users/' + u.id + '/location.json',
			to_post = {
				location: {
					latitude: u.location.latitude,
					location: u.location.longitude
				}
			};

	ajax_post(uri, to_post, success, error, this._token);
}

/**
* @function get a user's location
* @name getLocation
* @memberOf Communication.User
*/
CommunicationUser.prototype.getLocation = function(success) {
	var error = arguments[1],
			u = this._user,
			uri = '/users/' + u.id + '/location.json',
			to_post = {
				location: {
					latitude: u.location.latitude,
					location: u.location.longitude
				}
			};

	ajax_post(uri, to_post, success, error, this._token);
}

/**
 * @class server communication
 */
var Communication = function() {
	this.online = window.navigator.onLine;
	if (typeof this.online === 'undefined' || !this.online) {
		if (typeof debug != 'undefined' && debug) {
			console.log('offline');
		}
	}
	this.user = new CommunicationUser();
}