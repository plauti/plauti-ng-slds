plautiNgSlds.directive('plautiPickList', function () {

    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        require: 'ngModel',
        scope: {
            options: '=',
            ngModel: '=',
            ngDisabled: '=',
            required: '@',
            nameAttr: '@',
            valueAttr: '@',
            ngChange: '&',
            ngBlur: '&',
            svgPath: '@'
        },
        //#region == html template definition
        template: '<div class="slds slds-grid">'
    + '<div class="slds-form-element" style="width:100%">'
        + '<div class="slds-picklist slds-picklist--multi">'
            + '<ul class="slds-picklist__options slds-picklist__options--multi shown" style="width:100%; margin:0" aria-disabled="{{ngDisabled}}">'
                + '<li ng-repeat="option in options|filter:{$$selected:false}" class="slds-picklist__item" aria-selected="{{option.$$highlight}}" ng-click="highlight(option,$event)" ng-dblClick="toggleSelect(true,option,$event)">'
                    + '<span class="slds-truncate">'
                        + '<span>{{option[nameAttr]}}</span>'
                    + '</span>'
                + '</li>'
            + '</ul>'
        + '</div>'
    + '</div>'
    + '<div class="slds-grid slds-grid--vertical">'
        + '<button class="slds-button slds-button--icon-container" ng-click="toggleSelect(false)" ng-disabled="ngDisabled">'
            + '<svg aria-hidden="true" class="slds-button__icon">'
                + '<use xlink:href="{{leftSvgUrl}}"></use>'
            + '</svg>'
            + '<span class="slds-assistive-text">Arrow left</span>'
        + '</button>'
        + '<button class="slds-button slds-button--icon-container" style="margin:0" ng-click="toggleSelect(true)" ng-disabled="ngDisabled">'
            + '<svg aria-hidden="true" class="slds-button__icon">'
                + '<use xlink:href="{{rightSvgUrl}}"></use>'
            + '</svg>'
            + '<span class="slds-assistive-text">Arrow right</span>'
        + '</button>'
    + '</div>'
    + '<div class="slds-form-element" style="width:100%">'
        + '<div class="slds-picklist slds-picklist--multi">'
            + '<ul class="slds-picklist__options slds-picklist__options--multi shown" style="width:100%; margin:0" aria-disabled="{{ngDisabled}}">'
                + '<li ng-repeat="option in options|filter:{$$selected:true}|orderBy:\'$$sortOrder\'" class="slds-picklist__item" aria-selected="{{option.$$highlight}}" ng-click="highlight(option,$event)" ng-dblClick="toggleSelect(false,option,$event)" >'
                    + '<span class="slds-truncate">'
                        + '<span>{{option[nameAttr]}}</span>'
                    + '</span>'
                + '</li>'
            + '</ul>'
        + '</div>'
    + '</div>'
    + '<div class="slds-grid slds-grid--vertical">'
        + '<button class="slds-button slds-button--icon-container" ng-click="changeOrder(true)" ng-disabled="upDisabled">'
            + '<svg aria-hidden="true" class="slds-button__icon">'
                + '<use xlink:href="{{upSvgUrl}}"></use>'
            + '</svg>'
            + '<span class="slds-assistive-text">Arrow up</span>'
        + '</button>'
        + '<button class="slds-button slds-button--icon-container" style="margin:0" ng-click="changeOrder(false)" ng-disabled="downDisabled">'
            + '<svg aria-hidden="true" class="slds-button__icon">'
                + '<use xlink:href="{{downSvgUrl}}"></use>'
            + '</svg>'
            + '<span class="slds-assistive-text">Arrow down</span>'
        + '</button>'
    + '</div>'
+ '</div>',
        //#endregion
        link: function ($scope, iElm, iAttr, mdlCtrl) {
            $scope.$watchCollection('options', function () {
                $scope.applyTranformations();
            });

            $scope.$watchCollection('ngModel', function (newValue, oldValue) {
                $scope.applyTranformations();

                if ((newValue == undefined || newValue.length == 0) && $scope.required) {
                    mdlCtrl.$setValidity("required", false);
                }
                else {
                    mdlCtrl.$setValidity("required", true);
                }
            });

            $scope.$watch('ngDisabled', function () {
                $scope.removeHighlights();
            });
        },
        controller: function ($scope, $document, $log, $filter) {

            if (angular.isUndefined($scope.svgPath)) {
                $scope.svgPath = "/assets/icons/utility-sprite/svg/symbols.svg";
            }

            //URLs need to be concatenated in controller because concatenation for href is not allowed on view
            $scope.leftSvgUrl = $scope.svgPath + "#left";
            $scope.rightSvgUrl = $scope.svgPath + "#right";
            $scope.upSvgUrl = $scope.svgPath + "#up";
            $scope.downSvgUrl = $scope.svgPath + "#down";

            $scope.upDisabled = true;
            $scope.downDisabled = true;

            $scope.applyTranformations = function () {
                $scope.setSelectedOptions();
            };

            $scope.setSelectedOptions = function () {
                if (angular.isUndefined($scope.options) || angular.isUndefined($scope.ngModel))
                    return;
                for (var i = 0; i < $scope.options.length; i++) {
                    var index = indexOf($scope.ngModel, ($scope.valueAttr == undefined) ? $scope.options[i] : $scope.options[i][$scope.valueAttr]);
                    if (angular.isUndefined($scope.ngModel) || index == -1)
                        $scope.options[i].$$selected = false;
                    else {
                        $scope.options[i].$$selected = true;
                        $scope.options[i].$$sortOrder = index;
                    }

                    if (angular.isUndefined($scope.options[i].$$highlight))
                        $scope.options[i].$$highlight = false;
                }
            };

            $scope.removeHighlights = function () {
                if (!angular.isUndefined($scope.options)) {
                    for (var i = 0; i < $scope.options.length; i++) {
                        $scope.options[i].$$highlight = false;
                    }
                }

                $scope.setOrderingActions();
            };

            $scope.highlight = function (option, evt) {
                evt.stopPropagation();
                if ($scope.ngDisabled)
                    return;
                if (!(evt.ctrlKey || evt.metaKey)) {
                    var optionSiblings = $filter('filter')($scope.options, { $$selected: option.$$selected, $$highlight: true });
                    for (var i = 0; i < optionSiblings.length; i++) {
                        optionSiblings[i].$$highlight = false;
                    }
                }
                option.$$highlight = true;

                $scope.setOrderingActions();
            };

            $scope.setOrderingActions = function () {
                var selectedHighlighted = $filter('filter')($scope.options, { $$selected: true, $$highlight: true });
                if (selectedHighlighted.length != 1 || $scope.ngDisabled) {
                    $scope.upDisabled = true;
                    $scope.downDisabled = true;
                }
                else {
                    $scope.upDisabled = false;
                    $scope.downDisabled = false;

                    var option = selectedHighlighted[0];
                    if (!angular.isUndefined($scope.valueAttr)) {
                        option = option[$scope.valueAttr];
                    }
                    var index = indexOf($scope.ngModel, option);

                    if (index == 0) {
                        $scope.upDisabled = true;
                    }

                    if (index == $scope.ngModel.length - 1) {
                        $scope.downDisabled = true;
                    }
                }

            };


            $scope.toggleSelect = function (direction, option, evt) {
                if ($scope.ngDisabled)
                    return;

                if ($scope.ngModel == undefined || !angular.isArray($scope.ngModel)) {
                    $scope.ngModel = [];
                }

                //if option is not undefined, highlight the option and then execute select/unselect
                if (!angular.isUndefined(option)) {
                    $scope.highlight(option, evt);
                }

                var highlightedOptions = $filter('filter')($scope.options, { $$selected: !direction, $$highlight: true });

                if (highlightedOptions.length > 0) {



                    for (var i = 0; i < highlightedOptions.length; i++) {
                        var option = highlightedOptions[i];
                        if (!angular.isUndefined($scope.valueAttr)) {
                            option = option[$scope.valueAttr];
                        }

                        if (direction)
                            $scope.ngModel.push(option);
                        else {
                            var index = indexOf($scope.ngModel, option);
                            $scope.ngModel.splice(index, 1);
                        }

                    }

                    $scope.removeHighlights();


                    $timeout(function () { $scope.ngChange(); });
                }
            };

            $scope.changeOrder = function (moveUp) {
                var highlightedOptions = $filter('filter')($scope.options, { $$selected: true, $$highlight: true });
                var fireChanged = false;
                if (highlightedOptions.length > 0) {
                    for (var i = 0; i < highlightedOptions.length; i++) {
                        var option = highlightedOptions[i];

                        if (!angular.isUndefined($scope.valueAttr)) {
                            option = option[$scope.valueAttr];
                        }
                        var index = indexOf($scope.ngModel, option);

                        if ((moveUp && index > 0) || (!moveUp && index < $scope.ngModel.length - 1)) {
                            fireChanged = true;
                            swap($scope.ngModel, index, moveUp ? index - 1 : index + 1);
                        }

                    }
                }

                if (fireChanged) {
                    $scope.setOrderingActions();
                    $timeout(function () { $scope.ngChange(); });
                }
            };



            function indexOf(array, item) {
                for (var i = 0; i < array.length; i++) {
                    if (angular.equals(array[i], item))
                        return i;
                }
                return -1;
            }

            function swap(array, x, y) {
                var b = array[y];
                array[y] = array[x];
                array[x] = b;
            }

        }

    };

});