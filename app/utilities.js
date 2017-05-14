exports.success = function (data) {
	return {
		success: true,
		data: data || null
	};
};

exports.error = function (msg) {
	return {
		success: false,
		message: msg
	};
};