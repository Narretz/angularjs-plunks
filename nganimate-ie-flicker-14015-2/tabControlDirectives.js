'use strict';

angular.module('tabControlDirectives', []);

function tabGroupController($scope, $attrs) {
  var ctrl = this;
  $scope.tabs = [];

  // As a convenience for code below
  var tabs = $scope.tabs;
  // Give dependents access to tabs array
  ctrl.tabs = tabs;

  ctrl.addTab = function (tab) {
    //console.log('tabGroupController::addTab : called with ', tab);
    tabs.push(tab);
    if (1 === tabs.length) {
      tab.active = true;
    }
    else if (tab.active) {
      ctrl.selectTab(tab);
    }
  };

  ctrl.selectTab = function (selectedTab) {
    if (!selectedTab) {
      console.log('tabGroupController::selectTab : ', selectedTab, ': invalid tab received returning without modification!');
      return;
    }

    // Traverse our array of tabs to deselect the previous tab if different
    for (var i = 0, len = tabs.length; i < len; i++) {
      if (tabs[i].active && tabs[i] != selectedTab) {
        //console.log('tabGroupController::selectTab : tab ', tabs[i], ' was active is now inactive.');
        tabs[i].active = false;

        // N.B. we specify the address of the function rather than the function itself e.g. <my-tab .. deselect="tabDeselected" ...> NOT <my-tab .. deselect="tabDeselected(tab)" ...>
        // This way we can 'unwrap' the function and pass whatever parameters we want to it.
        if (tabs[i].onDeselect) {
           var func = tabs[i].onDeselect();
           if (angular.isFunction(func)) {
             // N.B. selected tab is a scope object, we don't want to return this just enough public information to indicate the de-selected tab.
             func({ heading: tabs[i].heading });
           }
          }
      }
    }

    selectedTab.active = true;
    // N.B. we specify the address of the function rather than the function itself e.g. <my-tab .. select="tabSelected" ...> NOT <my-tab .. select="tabSelected(tab)" ...>
    // This way we can 'unwrap' the function and pass whatever parameters we want to it.
    if (selectedTab.onSelect) {
      var func = selectedTab.onSelect();
      if (angular.isFunction(func)) {
        // N.B. selected tab is a scope object, we don't want to return this just enough public information to indicate the selected tab.
        func({ heading: selectedTab.heading });
      }
    }

    //console.log('tabGroupController::selectTab : tab ', selectedTab, ' is now active.');
  }

  ctrl.removeTab = function (tab) {
    var i = tabs.indexOf(tab);

    if (i > -1 && !destroyed && tab.active && tabs.length > 1) {
      // Select the next tab in the list (previous if tab being removed is last)
      var selIndex = (i == tabs.length - 1) ? i - 1 : 1 + 1;
      ctrl.selectTab(tabs[selIndex]);

      // Finally remove the tab
      tabs.splice(i, 1);
    }
  }

  var destroyed = false;
  $scope.$on('$destroy', function () {
    destroyed = true;

    $scope.$emit('calHeadInjection_Extract', $attrs);
  });
};

function tabGroupDirective() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    templateUrl: 'tabGroup-template.html',
    controller: ['$scope', '$attrs', tabGroupController]
  }
};

function tabDirective() {
  return {
    restrict: 'E',
    require: '^tabGroup',
    // templateUrl: 'tab-template.html',
    template: '<li ng-click="select()" >' +
      '<a href >{{heading}}</a>' +
    '</li>',
    // replace: true,
    transclude: true,
    scope: {
      active: '=',
      disableMe: '=', // this was previously 'disabled' but it causes problems with IE as disabled is a reserved DOM attribute
      heading: '@',
      onSelect: '&select',
      onDeselect: '&deselect'
    },
    compile: function (elem, attrs, transclude) {
      //log('tabDirective compile!');
      return function postLink(scope, elem, attrs, tabGroupController) {
        //console.log('tabDirective link!');
        scope.$watch('active', function (newVal) {
          if (newVal) {
            tabGroupController.selectTab(scope);
          }
        });

        scope.$on('$destroy', function () {
          tabGroupController.removeTab(scope);
        });

        scope.select = function () {
          //console.log('tabDirective (' + scope.heading + ') click! (internal function)');
          // if we need disable logic process it here
          if (!scope.disableMe) {
            scope.active = true;
          }
        }

        scope.$transcludeFn = transclude;
        tabGroupController.addTab(scope);
      }
    }
  };
};

function tabContentTranscludeDirective() {
  return {
    restrict: 'A',
    require: '^tabGroup',
    replace: true,
    link: function (scope, elem, attrs) {
      var tab = scope.$eval(attrs.tabContentTransclude);
      //console.log('tabContentTranscludeDirective : link : tab = ', tab);
      if(tab) {
        tab.$transcludeFn(tab.$parent, function (contents) {
          for (var i = 0, len = contents.length; i < len; i++) {
            elem.append(contents[i]);
          }
        });
      }
    }
  };
};

angular
  .module('tabControlDirectives')
  .directive('tabGroup', tabGroupDirective)
  .directive('myTab', tabDirective)
  .directive('tabContentTransclude', tabContentTranscludeDirective);