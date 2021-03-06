'use strict';

/**
 * Controller for the template creation component (which is also a rudimentary IDE)
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Controllers.controller('TemplatesCtrl', ['$scope', '$timeout', 'gettext', 'templates', 'templateService', 'confirm',
function ($scope, $timeout, gettext, templates, templateService, confirm) {

	// Existing templates
	//
	$scope.templates = templates;
	$scope.currTemplateId = null;

	// Manipulation of template files
	//
	$scope.filesToUpload = [];

	$scope.onFilesAdded = function(files) {
		//$scope.filesToUpload.push.apply(files);
		//console.log(files[0]);
		$scope.filesToUpload = $scope.filesToUpload.concat(files);
	};
	$scope.onFileRemoved = function(index) {
		$scope.filesToUpload.splice(index, 1);
	};
	$scope.onFilesCleared = function() {

		$scope.filesToUpload.length = 0;
		angular.element(document.getElementById('selectMultipleFilesInputEntry')).val('');
	};

	// Other form data and functions
	//
	$scope.templateData = {};
	$scope.filesUploaded = [];

	$scope.selectTemplate = function(t) {

		if ($scope.currFileDirty)
			return;
		$scope.resetSelectedFile();

		if (!t || ($scope.currTemplateId && $scope.currTemplateId === t.id)) {

			$scope.currTemplateId = null;

			$scope.templateData = {};
			$scope.filesUploaded = [];
		}
		else {

			$scope.currTemplateId = t.id;

			$scope.templateData.id = t.webble.templateid;
			$scope.templateData.name = t.webble.displayname;
			$scope.templateData.description = t.webble.description;

			$scope.filesUploaded = t.files;
		}
	};

	$scope.deleteTemplate = function(t) {
		$scope.formDeleteTemplate();
	};

	//******************************************************************

	$scope.queryTemplates = function(qid) {
		return templateService.queryById(qid).then(function(resp) { return resp.data; });
	};

	$scope.onSelectQueriedTemplate = function(t) {

		if ($scope.duringTimeout)
			$timeout.cancel($scope.duringTimeout);

		$scope.duringTimeout = $timeout(function () {

			if (!$scope.currTemplateId && $scope.templateData.id === t.id) {

				$scope.templateData.id = t.id;
				$scope.templateData.name = t.name;
				$scope.templateData.description = t.description;

				$scope.enableCopyTemplate = true;
			}
			delete $scope.duringTimeout;

		}, 2000);
	};

	//******************************************************************

	$scope.$watch('templateData.id', function(newValue, oldValue) {

		$scope.enableCopyTemplate = false;

		if (!newValue || newValue.length < 4)
			return;

		for (var i = 0; i < $scope.templates.length; ++i) {

			if ($scope.templates[i].webble.templateid === newValue) {

				if (!$scope.currTemplateId || $scope.currTemplateId !== $scope.templates[i].id)
					$scope.selectTemplate($scope.templates[i]);
				break;
			}
		}
	});

	////////////////////////////////////////////////////////////////////
	// Editing functionality
	//
	function getMode(f) {

		var mode = f.substr(f.lastIndexOf('.') + 1).toLowerCase();
		return mode == 'js' ? 'javascript' : mode == 'md' ? 'markdown' : mode == 'txt' ? 'text' : mode;
	}

	$scope.editorLoaded = function(editor) {

		$scope.editor = editor;

		// Configure editor the old-fashioned way...
		editor.setFontSize(14);
		editor.setHighlightActiveLine(true);
		editor.setAutoScrollEditorIntoView(true);
/*
		editor.setOption("minLines", 50);
		editor.setOption("maxLines", 50);
*/

		// Global behavior
		//
		editor.on('change', $scope.modifiedFile);

		editor.commands.addCommand({
			name: "save",
			bindKey: {win: "Ctrl-S", mac: "Command-S"},
			exec: $scope.saveFile
		});

		if ($scope.currFileContent) {

			var session = editor.getSession();
			session.setMode('ace/mode/' + $scope.currFileMode);
			session.setValue($scope.currFileContent);

			$scope.currFileDirty = $scope.currFileNew;
		}
	};

	$scope.resetSelectedFile = function() {

		$scope.currFile = null;
		$scope.currFileMode = null;
		$scope.currFileHandler = null;
		$scope.currFileContent = null;

		$scope.currFileDirty = false;
		$scope.currFileNew = false;
	};

	$scope.selectFile = function(f) {

		if ($scope.currFile === f || $scope.currFileDirty)
			return;

		var mode = getMode(f);

		$scope.resetSelectedFile();
		$scope.currFile = f;
		$scope.currFileMode = mode;

		switch(mode) {
			case 'jpg':
			case 'png':
			case 'gif':
			case 'tiff':
			case 'bmp':
				$scope.currFileHandler = "imageViewer";
				$scope.currFileContent = templateService.toUrl($scope.currTemplateId, f);
				break;
			case 'javascript':
			case 'html':
			case 'css':
			case 'json':
			case 'markdown':
			case 'text':
				templateService.getFile($scope.currTemplateId, f).then(function(resp) {

					$scope.currFileHandler = "editor";
					$scope.currFileContent = resp.data.content;
				});
				break;
			default:
				$scope.currFileHandler = "external";
				$scope.currFileContent = templateService.toUrl($scope.currTemplateId, f);
		}
	};

	$scope.newTemplateFiles = [
		{ name: 'view.html', help: gettext("How the Webble view is structured") },
		{ name: 'styles.css', help: gettext("How the Webble looks") },
		{ name: 'controllers.js', help: gettext("All your controller are belong to us") },
		{ name: 'directives.js', help: gettext("All your directive are belong to us") },
		{ name: 'filters.js', help: gettext("All your filter are belong to us") },
		{ name: 'services.js', help: gettext("All your service are belong to us") },
		{ name: 'manifest.json', help: gettext("Define external dependencies") },
		{ name: 'README.md', help: gettext("Write something that nobody will read, MD-style!") }
	];

	$scope.missingFile = function(fValue) {
		return $scope.filesUploaded.indexOf(fValue.name) === -1;
	};

	$scope.createFile = function(f) {

		$scope.resetSelectedFile();

		templateService.getBoilerplate(f).then(function(resp) {

			$scope.currFile = f;
			$scope.currFileMode = getMode(f);
			$scope.currFileHandler = "editor";
			$scope.currFileContent = resp.data;
			$scope.currFileNew = true;

			$scope.filesUploaded.push($scope.currFile);
		});
	};

	$scope.removeFile = function() {

		var index = $scope.filesUploaded.indexOf($scope.currFile);
		if (index != -1) {
			$scope.filesUploaded.splice(index, 1);
			$scope.resetSelectedFile();
		}
	};

	$scope.deleteFile = function() {

		confirm.show(gettext("Delete File Confirmation"),
			gettext("Are you sure you want to permanently delete the template file: ") + $scope.currFile,
			gettext("Delete"), gettext("Do Not Delete")).then(function () {

				templateService.deleteFile($scope.currTemplateId, $scope.currFile)
					.then($scope.removeFile);
			});
	};

	$scope.modifiedFile = function() {
		$scope.currFileDirty = !$scope.currFileDirty || $scope.currFileNew || $scope.editor.getSession().getUndoManager().hasUndo();
	};
	$scope.saveFile = function() {

		templateService.updateFile($scope.currTemplateId, $scope.currFile, $scope.editor.getValue())
			.then(function(resp) {

				$scope.currFileNew = false;
				$scope.currFileDirty = false;
			});
	};
	$scope.discardFileChanges = function() {

		if ($scope.currFileNew)
			$scope.removeFile();
		else
			$scope.currFileDirty = false;
	};

	////////////////////////////////////////////////////////////////////
	// Functionality for the form buttons
	//
	$scope.formDefaultAction = function() {

		if ($scope.currTemplateId)
			$scope.formUpdateTemplate();
		else if ($scope.templateData.id)
			$scope.formCreateTemplate();
	};

	$scope.formCreateTemplate = function() {

		templateService.create($scope.filesToUpload, $scope.templateData)
			.then(function(resp) {

				//$scope.$close(gettext("Successfully created template"));
				var t = resp.data;
				$scope.templates.push(t);

				$scope.onFilesCleared();
				$scope.selectTemplate(t);
			},
			function(response) {
				$scope.serverErrorMessage = response.data;
			},
			function(evt) {
				//$scope.uploadPercentage = Math.floor((100 * evt.loaded) / evt.total);
			});
	};

	$scope.formUpdateTemplate = function() {

		if (!$scope.currTemplateId)
			return;

		var id = $scope.currTemplateId;

		templateService.update(id, $scope.filesToUpload, $scope.templateData)
			.then(function(response) {

				for (var i = 0; i < $scope.templates.length; ++i) {
					if ($scope.templates[i].id === id) {

						//$scope.templates[i] = response.data;
						angular.copy(response.data, $scope.templates[i]); // WARNING: THIS IS NOT AUTOMATICALLY CAUGHT, WHY???

						// After the update try to keep the previous state intact to not interrupt Jonas' workflow
						//
						$scope.filesUploaded = $scope.templates[i].files;
						//$scope.resetSelectedFile();
						//
						break;
					}
				}
				$scope.onFilesCleared();
//				$scope.selectTemplate(null);
			},
			function(response) {
				$scope.serverErrorMessage = response.data;
			},
			function(evt) {
				//$scope.uploadPercentage = Math.floor((100 * evt.loaded) / evt.total);
			});
	};

	$scope.formDeleteTemplate = function(publish) {

		if (!$scope.currTemplateId)
			return;

		confirm.show(gettext("Delete Template Confirmation"),
			gettext("Are you sure you want to permanently delete the selected template and all its files?"),
			gettext("Delete"), gettext("Do Not Delete")).then(function () {

				var id = $scope.currTemplateId;
				(!publish ? templateService.clearFiles(id) : templateService.publish(id))
					.then(function () {

						for (var i = 0; i < $scope.templates.length; ++i) {
							if ($scope.templates[i].id === id) {
								$scope.templates.splice(i, 1);
								break;
							}
						}
						$scope.selectTemplate(null);
						$scope.filesUploaded.length = 0;
					},
					function (response) {
						$scope.serverErrorMessage = response.data;
					});
			});
	};

	$scope.formCopyTemplate = function(defid) {

		templateService.copy(defid)
			.then(function(resp) {

				var t = resp.data;
				$scope.templates.push(t);
				$scope.selectTemplate(t);

				$scope.enableCopyTemplate = false;
			},
			function(response) {
				$scope.serverErrorMessage = response.data;
			});
	};

	//******************************************************************

}]);
