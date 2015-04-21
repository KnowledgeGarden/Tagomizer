'use strict';

/**
 * Controller for the webble visualization component
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Controllers.controller('DataCtrl', [ '$scope', '$http', 'gettext', function ($scope, $http, gettext) {

	////////////////////////////////////////////////////////////////////
	// Utility functions
	//
	function dateWeight(from, to) {

		var nmonths = to.getMonth() - from.getMonth() + 12 * (to.getFullYear() - from.getFullYear());
		var ndays = to.getDate() - from.getDate() + 30 * nmonths;
		return ndays > 500 ? 0 : (500 - ndays) / 500;
	}
	function wsToGraph(ws) {

		var g = {nodes: [], links: []};
		var authorIndex = {};

		ws.forEach(function(w) {

			var authorNode;
			if (!authorIndex.hasOwnProperty(w.webble.author)) {

				authorNode = {
					index: g.nodes.length,

					name: w.webble.author,
					group: 100,
					value: 0.1,
					shape: 0
				};
				g.nodes.push(authorNode);
				authorIndex[w.webble.author] = authorNode;
			}
			else {

				authorNode = authorIndex[w.webble.author];
				authorNode.value += 0.1;
			}

			g.links.push({
				source: authorNode.index,
				target: g.nodes.length,
				value: 0.1 + dateWeight(new Date(w.updated), new Date()) * 20
			});
			g.nodes.push({
				webble: w,
				index: g.nodes.length,

				name: w.webble.displayname,
				group: dateWeight(new Date(w.created), new Date(w.updated)) * 100,
				value: w.rating,
				shape: w.is_trusted ? 2 : 4
			});
		});
		return g;
	}

	////////////////////////////////////////////////////////////////////
	// Scope methods
	//
	$scope.showInfo = function(selectedItem, index) {

		var w = selectedItem.webble;

		if (w)
			$scope.w = ($scope.w && w.webble.defid === $scope.w.webble.defid) ? null : w;
	};
	$scope.closeInfo = function() {
		$scope.w = null;
	};

	////////////////////////////////////////////////////////////////////
	// Initialization stuff
	//
	$scope.graph = null;

	$http.get('/api/webbles?limit=1821&verify=1').then(function(resp) {

		$scope.graph = wsToGraph(resp.data);
	});
}]);
