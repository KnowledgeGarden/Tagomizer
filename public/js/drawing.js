'use strict';

/**
 * Implements the interaction logic of the chaotic draw component
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Directives.directive("drawing", [ 'socket', function(socket){
	return {

		restrict: "A",
		link: function(scope, element, attrs){

			// Respond to mouse events
			//
			var drawing = false;
			var lastX;
			var lastY;

			element.bind('mousedown', function(event){

				lastX = (event.offsetX || event.clientX - $(event.target).offset().left);
				lastY = (event.offsetY || event.clientY - $(event.target).offset().top);
				drawing = true;
			});
			element.bind('mousemove', function(event){

				if (drawing){

					var currentX = (event.offsetX || event.clientX - $(event.target).offset().left);
					var currentY = (event.offsetY || event.clientY - $(event.target).offset().top);

					var data = { lastX: lastX, lastY: lastY, currentX: currentX, currentY: currentY };
					onDraw(data, data);

					lastX = currentX;
					lastY = currentY;
				}
			});
			element.bind('mouseup', function(event){
				drawing = false;
			});

			// Operations on ctx as the result of events
			//
			var ctx = element[0].getContext('2d');

			function onInfo(here, there) {

			}
			function onDraw(here, there) {

				if (here) {

					ctx.moveTo(here.lastX, here.lastY);
					ctx.lineTo(here.currentX, here.currentY);
					ctx.strokeStyle = "#00f";
                    ctx.lineWidth = 6;
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
					ctx.stroke();
				}
				if (there) {

					there.id = myId;
					socket.emit('interaction:move', there);
				}
			}
			function onSave(here, there) {

			}
			function onComm(here, there) {

			}

			// Start/stop listening for network events
			//
			var myId = 'drawingApp';

			attrs.$observe('id', function(value) {

				myId = value;

				socket.emit('interaction:started', myId);

				socket.addListener('interaction:info', onInfo);
				socket.addListener('interaction:move', onDraw);
				socket.addListener('interaction:save', onSave);
				socket.addListener('interaction:comm', onComm);
			});

			//scope.$on('$destroy', function() {
			element.on('$destroy', function() {

				socket.emit('interaction:ended', myId);

				socket.removeListener('interaction:info', onInfo);
				socket.removeListener('interaction:move', onDraw);
				socket.removeListener('interaction:save', onSave);
				socket.removeListener('interaction:comm', onComm);
			});
		}
	};
}]);
