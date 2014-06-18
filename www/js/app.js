angular.module('todo', ['ionic'])
  // Simple PouchDB factory
  .factory('todoDb', function() {
    var db = new PouchDB('todos');
    return db;
  })                                                   // inject ionicPopup & ionicListDelegate
  .controller('TodoCtrl', function($scope, $ionicModal, todoDb, $ionicPopup, $ionicListDelegate) {
    // Initialize tasks
    $scope.tasks = [];

    $scope.completionChanged = function(task) {
      task.completed = !task.completed;
      $scope.update(task);
    };

    // list changes to PouchDb database
    todoDb.changes({
      live: true,
      onChange: function (change) {
        if (!change.deleted) {
          todoDb.get(change.id, function(err, doc) {
            if (err) console.log(err);
            $scope.$apply(function() { //UPDATE
              for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i]._id === doc._id) {
                  $scope.tasks[i] = doc;
                  return;
                }
              } // CREATE / READ
              $scope.tasks.push(doc);
            });
          })     //////////////////////
        } else { // if change.delete //
          $scope.$apply(function () {
            for (var i = 0; i<$scope.tasks.length; i++) {
              if ($scope.tasks[i]._id === change.id) {
                $scope.tasks.splice(i,1);
              }
            }
          })
        }
      }
    });

    $scope.update = function (task) {
      todoDb.get(task._id, function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          todoDb.put(angular.copy(task), doc._rev, function (err, res) {
            if (err) console.log(err);
          });
        }
      });
    };

    ////////////////////////
    // DELETE task IN POUCHDB
    ////////////////////////
    $scope.delete = function(task) {
      todoDb.get(task._id, function (err, doc) {
        todoDb.remove(doc, function (err, res) {});
      });
    };

    ////////////////////////
    // EDIT task.title with ionicPopup
    ////////////////////////
    $scope.editTitle = function (task) {
      var scope = $scope.$new(true);
      scope.data = {response: task.title };
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
          $scope.update(task);
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
      todoDb.post(angular.copy(task), function(err, res) {
        if (err) console.log(err)
        task.title = "";
      });
      $scope.taskModal.hide();
    };

    $scope.newTask = function() {
      $scope.taskModal.show();
    };

    $scope.closeNewTask = function() {
      $scope.taskModal.hide();
    };

  });
