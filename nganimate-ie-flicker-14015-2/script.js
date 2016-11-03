'use strict';

// Code goes here

angular.module('testApp', [
  'ngAnimate',
  'directives'
  ]);

  function testAppControllerFunction($scope) {
    $scope.name = 'testAppController';
  };

angular
  .module('testApp')
  .config(function($animateProvider) {
    $animateProvider.classNameFilter(/animate-me/);
  })
  .controller('testAppController', ['$scope', testAppControllerFunction])
  .directive('ngShow', function() {
    return {
      link: function(scope, element) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === "class") {
                    var attributeValue = $(mutation.target).prop(mutation.attributeName);
                    console.info(element[0].id, "Class attribute changed to:", element[0].classList.toString());
                }
            });
        });
        observer.observe(element[0],  {
            attributes: true
        });
      }
    }
  })