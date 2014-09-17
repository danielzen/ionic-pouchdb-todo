angular.module('pouchdb')

// This service binds the scope expression to a pouchdb/couchdb database.
// There is no promise provided
  .factory('pouchBindingSimple', ['$timeout', '$parse', 'PouchDB', function($timeout, $parse, PouchDB) {
    var stopTheWatch;
    return function(reference, scope, expression) {
      var getObj = $parse(expression);
      var setObj = getObj.assign;
      if (!setObj) {
        throw new Error('expression ' + expression + 'must be assignable');
      }
      var database = new PouchDB(reference);
      database.get(expression).then(
        function(res) {
          setObj(scope, res);
        },
        function() {
          newVal = angular.copy(getObj(scope));
          database.put(newVal, expression).then(
            function(res) {
              newVal._rev = res.rev;
              newVal._id = res.id;
              setObj(newVal);
            },
            function(err) {
              console.log(err);
            })
        });

      function equalsIgnoreRev(val1, val2) {
        var cleanVal1 = angular.copy(val1);
        var cleanVal2 = angular.copy(val2);
        cleanVal1._rev = null;
        cleanVal2._rev = null;
        return angular.equals(cleanVal1, cleanVal2);
      }

      database.changes({
        live: true,
        onChange: function(change) {
          if (!change.deleted) {
            database.get(change.id).then(
              function(res) {
                setObj(scope, res);
              },
              function(err) {
                console.log(err);
              });
          }
        }
      });

      var listener = function(ngValue) {
        database.get(expression).then(
          function(dbVal) {
            if (!equalsIgnoreRev(dbVal, ngValue) && ngValue._id) {
              database.put(angular.copy(ngValue)).then(
                function(res) {
                  ngValue._rev = res.rev;
                },
                function(err) {
                  console.log(err);
                });
            }
          });
      };
      stopTheWatch = scope.$watch(getObj, listener, true);
    }
  }]);
