angular.module('todo', ['ionic','pouchdb'])
  .controller('TodoCtrl', function($scope, $ionicModal, $ionicPopup, $ionicListDelegate, pouchCollection) {


    ////////////////////////
    // Replace PouchDb database calls with pouchCollection
    ////////////////////////
    $scope.todos = pouchCollection('todoslib');

    $scope.online = false;
    $scope.toggleOnline = function() {
      $scope.online = !$scope.online;
      if ($scope.online) {  // Read http://pouchdb.com/api.html#sync
        ////////////////////////
        // sync to CouchDb with pouchCollection reference
        ////////////////////////
        $scope.sync = $scope.todos.$db.replicate.sync('http://127.0.0.1:5984/todoslib', {live: true})
          .on('error', function (err) {
            console.log("Syncing stopped");
            console.log(err);
          });
      } else {
        $scope.sync.cancel();
      }
    };

    $scope.completionChanged = function(task) {
      task.completed = !task.completed;
      $scope.todos.$update(task);
    };

    $scope.delete = function(task) {
      $scope.todos.$remove(task);
    };

    $scope.editTitle = function (task) {
      var scope = $scope.$new(true);
      scope.data = { response: task.title } ;
      $ionicPopup.prompt({
        title: 'Edit task:',
        scope: scope,
        buttons: [
          { text: 'Cancel',  onTap: function(e) { return false; } },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              return scope.data.response
            }
          },
        ]
      }).then(function (newTitle) {
        if (newTitle && newTitle != task.title) {
          task.title = newTitle;
          $scope.todos.$update(task);
        }
        $ionicListDelegate.closeOptionButtons();
      });
    };

    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope
    });

    $scope.createTask = function(task) {
      task.completed = false;
      $scope.todos.$add(task);
      console.log("Added "+task.title+" to todos");
      $scope.taskModal.hide();
    };

    $scope.newTask = function() {
      $scope.taskModal.show();
    };

    $scope.closeNewTask = function() {
      $scope.taskModal.hide();
    };

  });
