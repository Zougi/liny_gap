/**
 * @function transform string into function and gets its value
 * @param {String} binding's name
 * @returns function's name value
 */
function bind_getter(bind_name) {
	var context = window,
		namespaces = bind_name.split('.'),
		func = namespaces.pop();
		
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func];
}

/**
 * @function set value to fuction whose name is specify by bind_name
 * @param {String} binding's name
 * @param {Object} value to set, can be of any type
 */
function bind_setter(bind_name, arg) {
	var context = window,
		namespaces = bind_name.split('.'),
		func = namespaces.pop();
		
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	context[func] = arg;
}