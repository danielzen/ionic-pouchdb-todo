angular.module('todo', ['ionic'])
  .controller('TodoCtrl', function($scope, $ionicModal) {
    // Initialize tasks
    ////////////////////////
    // tasks starts empty
    ////////////////////////
    $scope.tasks = [];

    $scope.completionChanged = function(task) {
      task.completed = !task.completed;
    };

    ////////////////////////
    // Use $ionicModal to put 'taskModal' in $scope
    ////////////////////////
    $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope
    });

    ////////////////////////
    // push new task onto tasks array
    ////////////////////////
    $scope.createTask = function(task) {
      task.completed = false;
      $scope.tasks.push(angular.copy(task));
      task.title = "";
      $scope.taskModal.hide();
    };

    ////////////////////////
    // show taskModal for newTask
    ////////////////////////
    $scope.newTask = function() {
      $scope.taskModal.show();
    };

    ////////////////////////
    // hide taskModal to closeNewTask
    ////////////////////////
    $scope.closeNewTask = function() {
      $scope.taskModal.hide();
    };

  });
