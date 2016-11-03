'use strict';

angular.module('directives', [
    'tabControlDirectives'
  ]);

function parentDirectiveControllerFunction($scope) {
  $scope.message = 'parent directive controller';
  
  $scope.tabs = [
    { title: 'Port', active: true, disabled: false, pageUrl: 'portCorruptionStatistics.html' },
    { title: 'Profile', active: false, disabled: false, pageUrl: 'profileCorruptionStatistics.html' }
  ];
  
  $scope.profile = {
    port : 'Port1',
    position : 1 
  }
  
  $scope.stats = {};
  $scope.stats = {};
  $scope.stats.port1 = {
    totalErroredSymbolCount : 15000,
    totalSymbolCount : 2300,
    totalErroredPackets : 1789,
    totalLostPackets : 234,
    totalMisorderedPackets : 345,
    totalRepeatedPackets : 888,
    totalPackets : 233,
    totalImpairedPackets : 333
  }
  
  $scope.stats.port2 = {
    totalErroredSymbolCount : 15000,
    totalErroredPackets : 1789,
    totalLostPackets : 234,
    totalMisorderedPackets : 345,
    totalRepeatedPackets : 888,
    totalPackets : 233,
    totalImpairedPackets : 333
  }
};

function parentDirectiveFunction() {
  return {
    restrict : 'E',
    replace: true,
    templateUrl: 'parentDirectiveTemplate.html',
    controller: ['$scope', parentDirectiveControllerFunction]
  };
}

angular
  .module('directives')
  .directive('parentDirective', [parentDirectiveFunction]);