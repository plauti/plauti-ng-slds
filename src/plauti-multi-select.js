plautiNgSlds.directive('plautiMultiSelect', function() {
    return {
        restrict : 'E',
        replace : true,
        require : 'ngModel',
        scope : {
            options : '=',
            ngModel : '=',
            ngDisabled : '=',
            required : '@',
            nameAttr : '@',
            valueAttr : '@',
            ngChange : '&',
            svgPath : '@',
            defaultText : '@'
        },
        template : '<div class="slds slds-picklist" aria-expanded="true">' + '<button class="slds-button slds-button--neutral slds-picklist__label plauti-select-button" style="width:100%" aria-haspopup="true" ng-click="toggleDropdown($event)" aria-disabled="{{$parent.ngDisabled}}" ng-disabled="ngDisabled">' + '<span class="slds-truncate">{{buttonText}}</span>' + '<svg aria-hidden="true" class="slds-icon">' + '<use xlink:href="{{downSvgUrl}}"></use>' + '</svg>' + '</button>' + '<div class="slds-dropdown slds-dropdown--left slds-dropdown--menu" style="width:100%; max-width:100%" ng-show="dropVisible">' + '<ul class="slds-dropdown__list" role="menu">' + '<li ng-repeat="option in options track by $index"  class="slds-dropdown__item" ng-class="{true:\'slds-is-selected\'}[option.$$selected==true]" ng-click="toggleSelection(option,$event)" aria-disabled="{{$parent.ngDisabled}}">' + '<a href="javascript:void(0)" role="menuitemradio" >' + '<p class="slds-truncate">' + '<svg aria-hidden="true" class="slds-icon slds-icon--selected slds-icon--x-small slds-icon-text-default slds-m-right--x-small">' + '<use xlink:href="{{$parent.checkSvgUrl}}"></use>' + '</svg>{{option[nameAttr]}}' + '</p>' + '</a>' + '</li>' + '</ul>' + '</div>' + '</div>',
        link : function($scope, iElm, iAttr, mdlCtrl) {
            $scope.$watchCollection('options', function() {
                $scope.applyTranformations();
            });

            $scope.$watchCollection('ngModel', function(newValue, oldValue) {
                $scope.applyTranformations();

                if ((newValue == undefined || newValue.length == 0) && $scope.required) {
                    mdlCtrl.$setValidity("required", false);
                } else {
                    mdlCtrl.$setValidity("required", true);
                }
            });
        },
        controller : function($scope, $document, $log, $filter, $timeout) {
            if (angular.isUndefined($scope.svgPath)) {
                $scope.svgPath = "/assets/icons/utility-sprite/svg/symbols.svg";
            }

            //URLs need to be concatenated in controller because concatenation for href is not allowed on view
            $scope.downSvgUrl = $scope.svgPath + "#down";
            $scope.checkSvgUrl = $scope.svgPath + "#check";

            $scope.dropVisible = false;

            if (angular.isUndefined($scope.defaultText)) {
                $scope.defaultText = 'Select an Option';
            };

            $scope.toggleDropdown = function(evt) {
                //This is to tackle multiple dropdowns on a single page. This will avoid multiple drops to be visible simultaneously!
                var visibilityToSet = !$scope.dropVisible;
                $timeout(function() {
                    $scope.dropVisible = visibilityToSet;
                });
            };

            $document.on('click', function() {
                $scope.$apply(function() {
                    $scope.dropVisible = false;
                });
            });

            $scope.applyTranformations = function() {
                $scope.setSelectedOptions();
                $scope.setButtonText();
            };

            $scope.setSelectedOptions = function() {
                if (angular.isUndefined($scope.options))
                    return;
                for (var i = 0; i < $scope.options.length; i++) {
                    if (angular.isUndefined($scope.ngModel) || indexOf($scope.ngModel, ($scope.valueAttr == undefined) ? $scope.options[i] : $scope.options[i][$scope.valueAttr]) == -1)
                        $scope.options[i].$$selected = false;
                    else
                        $scope.options[i].$$selected = true;
                }
            };

            $scope.setButtonText = function() {
                if ($scope.ngModel == undefined || !angular.isArray($scope.ngModel) || $scope.ngModel.length == 0) {
                    $scope.buttonText = $scope.defaultText;
                } else if (angular.isArray($scope.ngModel) && $scope.ngModel.length == 1) {
                    var selectedOption = $filter('filter')($scope.options, { $$selected: true })[0];
                    $scope.buttonText = selectedOption[$scope.nameAttr];
                } else if (angular.isArray($scope.ngModel) && $scope.ngModel.length > 1) {
                    var selectedOptions = $filter('filter')($scope.options, {
                        $$selected : true
                    });
                    var buttonText = selectedOptions[0][$scope.nameAttr];
                    for (var i = 1; i < selectedOptions.length; i++) {
                        buttonText += ", " + selectedOptions[i][$scope.nameAttr];
                    }
                    $scope.buttonText = buttonText;
                } else {
                    $log.error('Plauti Multi-Select Directive: "ng-model" value must be undefined or an array object.');
                }
                ;
            };

            $scope.toggleSelection = function(option, evt) {
                //need to stop event propagation even in case select is disabled
                evt.stopPropagation();

                if ($scope.ngDisabled)
                    return;

                if ($scope.ngModel == undefined || !angular.isArray($scope.ngModel)) {
                    $scope.ngModel = [];
                }
                if (!angular.isUndefined($scope.valueAttr)) {
                    option = option[$scope.valueAttr];
                }

                var index = indexOf($scope.ngModel, option);
                if (index == -1)
                    $scope.ngModel.push(option);
                else
                    $scope.ngModel.splice(index, 1);

                $timeout(function() {
                    $scope.ngChange();
                });

            };

            function indexOf(array, item) {
                for (var i = 0; i < array.length; i++) {
                    if (angular.equals(array[i], item))
                        return i;
                }
                return -1;
            };

        }
    };

}); 