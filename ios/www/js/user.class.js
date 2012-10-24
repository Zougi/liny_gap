/**
 * @fileOverview user class description.
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

/**
 * @class Represents an user
 */
var User = function() {
	return {
		id: '',
		trustGauge: 0,
		matchPercentage: 0,
		avatar: '',
		info: '',
		contacts: [],
		email: '',
		alias: '',
		password: '',
		secret: '',
		provider: {
	   	service_type: '',
	   	service_user_id: '',
	  	service_user_token: ''
	  },
		profile: {
			birthdate: 0,
			firstname: '',
			lastname: '',
			gender: '',
			license: '',
			live_with: ''
		},
		physique: {
			rate: {
				tatoo: '',
				piercing: ''
			},
			color: {
				skin: '',
				eyes: '',
				hair: ''
			},
			size: {
				height: '',
				weight: '',
				hair: ''
			}
		},
		personality: {
			relationship: {
				type : '',
				gender: ''
			},
			rate: {
				party: '',
				alcohol: '',
				tobacco: ''
			},
			interest: {
				movies: [],
				songs: [],
				readings: [],
				tv_shows: [],
				hobbies: [],
				sports: []
			},
			job: [],
			studies: [],
			languages: []
		},
		location: {
			latitude: 0,
			longitude: 0
		},
		filters: {
			profile: {
				max: {
					age: ''
				},
				min: {
					age: ''
				},
				license: ''
			},
			physique: {
				rate: {
					max: {
						tatoo: '',
						piercing: ''
					},
					min: {
						tatoo: '',
						piercing: ''
					}
				},
				color: {
					hair: [ 'black', 'blond', 'brown', 'grey', 'white', 'ginger' ],
					eyes: [ 'blue', 'brown', 'green' ],
					skin: [ 'white', 'brown', 'yellow', 'black' ]
				},
				size: {
					max: {
						height: '',
						weight: '',
						hair: ''
					},
					min: {
						height: '',
						weight: '',
						hair: ''
					}
				}
			},
			personality: {
				relationship: {
					type : '',
					gender: ''
				},
				rate: {
					max: {
						party: '',
						alcohol: '',
						tobacco: ''
					},
					min: {
						party: '',
						alcohol: '',
						tobacco: ''
					}
				},
				job: [],
				studies: [],
				languages: []
			}
		}
	}
}