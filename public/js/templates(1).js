'use strict';

/**
 * The template server resource
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Services.factory('Template', ['$resource', function($resource) {
	return $resource('/api/dev/webbles/:id', { id: '@id' });
}]);

/**
 * The template loader pattern that can be used for multiple instantiations/requests
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Services.factory('TemplatesLoader', ['Template', '$q', 'gettext', function(Template, $q, gettext) {
	return function() {

		var delay = $q.defer();

		Template.query(
			function(templates) {
				delay.resolve(templates);
			},
			function() {
				delay.reject(gettext("Unable to retrieve templates"));
			});
		return delay.promise;
	};
}]);

/**
 * The template service for creating and modifying templates BUT ALSO
 * for retrieving and editing individual files within templates
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Services.factory('templateService', ['$q', '$upload', '$http', function($q, $upload, $http) {
	return {

		query: function(q) {
			return $http.get('/api/dev/templates?q=' + encodeURIComponent(q));
		},
		queryById: function(id) {
			return $http.get('/api/dev/templates?qid=' + encodeURIComponent(id));
		},

		//**************************************************************

		create: function(files, templateData) {

			return $upload.upload({
				url: '/api/dev/webbles',
				method: 'POST',
				data: templateData,
				file: files
			});
		},

		copy: function(defid) {
			return $http.post('/api/dev/webbles/' + encodeURIComponent(defid));
		},

		update: function(id, files, templateData) {

			return $upload.upload({
				url: '/api/dev/webbles/' + id + '/files',
				method: 'PUT',
				data: templateData,
				file: files
			});
			// .progress(function(evt) {}
			// .success(function(data, status, headers, config) {}
			// .error(function(data, status, headers, config) {}
		},

		clearFiles: function(id) {
			return $http.delete('/api/dev/webbles/' + id + '/files');
		},

		getFiles: function(id) {
			return $http.get('/api/dev/webbles/' + id + '/files');
		},

		publish: function(id) {
			return $http.put('/api/dev/webbles/' + id + '/publish')
		},

		//**************************************************************

		getBoilerplate: function(file) {
			return $http.get('/data/WebbleDevPack_Unpacked/' + file);
		},

		//**************************************************************

		toUrl: function(id, file) {
			return '/devwebbles/' + id + '/0/' + encodeURIComponent(file);
		},

		getFile: function(id, file) {
			return $http.get('/api/dev/webbles/' + id + '/files/' + encodeURIComponent(file));
		},
		updateFile: function(id, file, content) {
			return $http.put('/api/dev/webbles/' + id + '/files/' + encodeURIComponent(file), { content: content });
		},
		deleteFile: function(id, file) {
			return $http.delete('/api/dev/webbles/' + id + '/files/' + encodeURIComponent(file));
		}
	};
}]);
