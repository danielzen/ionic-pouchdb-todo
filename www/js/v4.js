angular.module('todo', ['ionic'])
  ////////////////////////
  // Simple PouchDB synchronization factory
  ////////////////////////
  .factory('todoDb', function() {
    var db = new PouchDB('todos');
    return db;
  })
  .controller('TodoCtrl', function($scope, $ionicModal, todoDb) { // inject todoDb factory
    // Initialize tasks
    $scope.tasks = [];

    $scope.completionChanged = function(task) {
      task.completed = !task.completed;
      this.update(task);
    };

    ////////////////////////
    // http://pouchdb.com/api.html#changes
    // list of changes to docs in todoDb
    // modify ng-model accordingly
    ////////////////////////
    todoDb.changes({
      live: true,
      onChange: function (change) {
        if (!change.deleted) { // IF THE CHANGE IS A DELETE, IGNORE
          // GET THE doc (a task) from the change.id
          todoDb.get(change.id, function(err, doc) {
            if (err) console.log(err); ////////////
            $scope.$apply(function() { // UPDATE //
              // INEFFICIENTLY FIND task THAT HAS CHANGED
              for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i]._id === doc._id) {
                  // REPLACE THE TASK WITH FETCHED doc
                  $scope.tasks[i] = doc;
                  return;
                } //////////////////////////////////////////
              }   // IF UNIQUE doc._id NOT FOUND ADD task //
              $scope.tasks.push(doc);
            });
          })
        }
      }
    });

    ////////////////////////
    // UPDATE task IN POUCHDB
    ////////////////////////
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

    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope
    });

    $scope.createTask = function(task) {
      task.completed = false;
      ////////////////////////
      // CREATE task IN POUCHDB
      ////////////////////////
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
