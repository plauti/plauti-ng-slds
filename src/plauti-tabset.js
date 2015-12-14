plautiNgSlds.directive('plautiTabset', function ($compile, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:{scoped:'='},
        controller: function ($scope) {
            $scope.templateUrl = '';
            var tabs = $scope.tabs = [];
            this.scoped = $scope.scoped;

            this.selectTab = function (tab) {
                angular.forEach(tabs, function (tab) {
                    tab.active = false;
                });
                tab.active = true;
                $scope.templateUrl = tab.templateUrl;
            };

            this.setTabTemplate = function (templateUrl) {
                $scope.templateUrl = templateUrl;
            };

            this.addTab = function (tab) {
                if (tabs.length == 0) {
                    tab.active = true;
                }
                tabs.push(tab);
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
            templateUrl: '@',
            active: '=?'
        },
        link: function (scope, element, attrs, tabsetController) {
            scope.$watch('active', function (newValue, oldValue) {
                if (newValue && !oldValue) {
                    tabsetController.selectTab(scope);
                }
            });


            tabsetController.addTab(scope);

            scope.select = function () {
                scope.active = true;
            };

            scope.deselect = function () {
                scope.active = false;
            };
            
            if (scope.active) {
                tabsetController.selectTab(scope);
            };

            scope.scoped = tabsetController.scoped;
        },
        template: '<li class="slds-text-heading--label"  ng-class="{\'slds-active\':active,\'slds-tabs--scoped__item\':scoped,\'slds-tabs--default__item\':!scoped}" title="{{title}}" role="presentation"><a ng-class="{\'slds-tabs--scoped__link\':scoped,\'slds-tabs--default__link\':!scoped}" ng-click="select()" href="#" role="tab" aria-selected="{{active}}">{{ title }}</a></li>',

    };
});
