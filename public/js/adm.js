'use strict';

/**
 * Controller for the app & server's administration interface.
 * This interface is available only to administrators.
 *
 * @author Giannis Georgalis <jgeorgal@meme.hokudai.ac.jp>
 */
ww3Controllers.controller('AdmCtrl', [ '$scope', 'gettext', 'confirm', 'server', 'UserAccounts', 'ActiveSessions',
  function ($scope, gettext, confirm, server, UserAccounts, ActiveSessions) {

    $scope.restartServer = server.updateAndRebootServer;

    $scope.updateApp = function() {

      confirm.show(gettext("Update Application Warning"),
        gettext("This operation will fetch the latest version of the Webble world application from the central git repository at BitBucket.org. It will not restart the server, HOWEVER, during the update, users may be affected by getting served incosistent versions of application components. Are you sure you want to proceed with the update?"),
        gettext("Update"), gettext("Do not update")).then(function() {

          $scope.updating = true;
          server.updateApplication().then(function(resp) {

            $scope.updateOutput = resp.data;
            $scope.updating = false;
          });
        });
    };

    $scope.allUsers = UserAccounts.query();
    $scope.allSessions = ActiveSessions.query();
  }]);
