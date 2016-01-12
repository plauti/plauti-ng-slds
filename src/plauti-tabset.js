plautiNgSlds.directive('plautiTabset', function ($compile, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: { scoped: '=', activeTab: '=?' },
        controller: function ($scope, $filter) {

            $scope.templateUrl = '';
            var tabs = $scope.tabs = [];
            this.scoped = $scope.scoped;

            $scope.activateTab = function (tabToActivate) {
                angular.forEach(tabs, function (tab) {
                    tab.active = false;
                });
                tabToActivate.active = true;
                $scope.templateUrl = tabToActivate.templateUrl;
            };

            $scope.$watch('activeTab', function (newValue, oldValue) {
                if (angular.isUndefined(newValue))
                    return;

                var tabToActivate = $filter('filter')($scope.tabs, { name: newValue });
                if (tabToActivate.length == 1) {
                    $scope.activateTab(tabToActivate[0]);
                };

            });

            this.addTab = function (tab) {
                tabs.push(tab);
                if (tabs.length == 1 && angular.isUndefined($scope.activeTab)) {
                    $scope.activeTab = tab.title;
                }
                else if (tab.name == $scope.activeTab) {
                    this.activateTab(tab);
                }

            };

            this.selectTab = function (tab) {
                $scope.activeTab = tab.name;
            };

            

            
        },
        template: '<div ng-class="{\'slds-tabs--scoped\':scoped,\'slds-tabs--default\':!scoped}">'
  + '<ul ng-class="{\'slds-tabs--scoped__nav\':scoped,\'slds-tabs--default__nav\':!scoped}" role="tablist" ng-transclude>'
  + '</ul>'
  + '<div class="slds-show" ng-class="{\'slds-tabs--scoped__content\':scoped,\'slds-tabs--default__content\':!scoped}" role="tabpanel">'
  + '<ng-include src="templateUrl"></ng-include>'
  + '</div>'
  + '</div>',
    };
});

plautiNgSlds.directive('plautiTab', function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        require: '^plautiTabset',
        scope: {
            title: '@',
            name: '@',
            templateUrl: '@'
        },
        link: function (scope, element, attrs, tabsetController) {
          tabsetController.addTab(scope);
            scope.select = function () {
                tabsetController.selectTab(scope);
            };
            scope.scoped = tabsetController.scoped;
        },
        template: '<li class="slds-text-heading--label"  ng-class="{\'slds-active\':active,\'slds-tabs--scoped__item\':scoped,\'slds-tabs--default__item\':!scoped}" title="{{title}}" role="presentation"><a ng-class="{\'slds-tabs--scoped__link\':scoped,\'slds-tabs--default__link\':!scoped}" ng-click="select()" href="#" role="tab" aria-selected="{{active}}">{{ title }}</a></li>',

    };
});
