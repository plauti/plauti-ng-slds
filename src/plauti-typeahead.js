plautiNgSlds.filter("htmlDecode", ['$sce', function($sce) {
	var div = document.createElement('div');
    return function(text) {
        div.innerHTML = text;
        return $sce.trustAsHtml(div.textContent);
    };
}]);

plautiNgSlds.directive("plautiTypeahead", function ($timeout,$log) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        //templateUrl:'plautiPickList.html',
        template:"<div class=\"slds-lookup\">"
    + "    <div class=\"slds-form-element\">"
    + "        <div class=\"slds-form-element__control slds-input-has-icon slds-input-has-icon--right\">"
    + "            <svg aria-hidden=\"true\" class=\"slds-input__icon\">"
    + "                <use xlink:href=\"{{searchSvgUrl}}\"><\/use>"
    + "            <\/svg>"
    + "            <div class=\"slds-pill__container slds-hide\"><\/div>"
    + "            <input class=\"slds-input slds-show\" tabindex=\"{{tabOrder}}\" type=\"text\" ng-disabled=\"ngDisabled\" ng-model=\"searchText\" ng-change=\"queryChanged()\" ng-keydown=\"highlightOption($event)\" \/>"
    + "        <\/div>"
    + "    <\/div>"
    + "    <div class=\"slds-lookup__menu\" role=\"listbox\" ng-show=\"dropActive\">"
    + "        <div class=\"slds-lookup__item\" ng-show=\"isLoading\">"
    + "            <svg aria-hidden=\"true\" class=\"slds-icon slds-icon-text-default slds-icon--small\">"
    + "                <use xlink:href=\"{{spinnerSvgUrl}}\"><\/use>"
    + "            <\/svg>&nbsp;&nbsp;Loading Options..."
    + "        <\/div>"
    + "        <div class=\"slds-lookup__item\" ng-show=\"noData\">"
    + "            &nbsp;&nbsp;No Data Found"
    + "        <\/div>"
    + "        <ul class=\"slds-lookup__list\" role=\"presentation\">"
    + "            <li class=\"slds-lookup__item\" ng-repeat=\"option in options track by $index\" ng-class=\"{true:'active'}[$index==$parent.activeIndex]\" aria-selected=\"{{$index==$parent.activeIndex}}\">"
    + "                <a href=\"#\" role=\"option\" ng-click=\"selectOption(option,$event);\" >"
    + "                    <svg aria-hidden=\"true\" class=\"slds-icon {{option[iconCssAttr]}} slds-icon--small\">"
    + "                        <use xlink:href=\"{{option[iconAttr]}}\"><\/use>"
    + "                    <\/svg><span ng-bind-html=\"option[nameAttr]\"/>"
    + "                <\/a>"
    + "            <\/li>"
    + "        <\/ul>"
    + "    <\/div>"
    + "<\/div>",
        scope: {
            ngModel: '=',
            ngModelDisplay: '=',
            ngDisabled: '=',
            required: '@',
            tabOrder: '=',
            svgPath: '@',
            options: '=',
            valueAttr: '@',
            nameAttr: '@',
            typeaheadSelectOnBlur: '=',
            iconAttr: '@',
            iconCssAttr: '@',
            typeaheadWaitMs: '@',
            typeaheadMinLength: '@',
            typeaheadOptionsMethod: '&',
            typeaheadOnSelect: '&'
        },
        link: function ($scope, iElm, iAttr, mdlCtrl) {


            $scope.listElement = angular.element(iElm[0].querySelector('.slds-lookup__list'))[0];

            $scope.$watch('ngModel', function (value) {
                if (angular.isDefined(value)) {
                    mdlCtrl.$setValidity("required", true);
                }
                else if ($scope.required) {
                    mdlCtrl.$setValidity("required", false);
                }
            });

            $scope.$watch('ngModelDisplay', function (value) {
                if (angular.isDefined(value)) {
                    $scope.searchText = $scope.sanitize(value);
                }
                else if (angular.isUndefined($scope.searchText)||$scope.searchText.length==0) {
                    $scope.searchText = "";
                }
            });

            $scope.$watchCollection('options', function (value) {
                $scope.isLoading = false;
                if (angular.isUndefined($scope.options) || $scope.options.length == 0) {
                    $scope.noData = true;
                }
                else if ($scope.dropActive) {
                    $scope.noData = false;
                    if ($scope.options.length == 1 && $scope.options[0][$scope.nameAttr] == $scope.searchText) {
                        $scope.ngModelDisplay = $scope.options[0][$scope.nameAttr];
                        $scope.ngModel = angular.isDefined($scope.valueAttr) ? $scope.options[0][$scope.valueAttr] : $scope.options[0];
                        $scope.dropActive = false;
                    }
                    $scope.activeIndex = 0;
                }
            });
        },
        controller: function ($scope, $document, $sce, $filter) {
            var timeoutPromise;
            var cancelPreviousTimeout = function () {
                if (timeoutPromise) {
                    $timeout.cancel(timeoutPromise);
                }
            };
            $scope.init = function () {
                if (angular.isUndefined($scope.typeaheadWaitMs)) {
                    $scope.typeaheadWaitMs = 0;
                }

                if (angular.isUndefined($scope.typeaheadMinLength)) {
                    $scope.typeaheadMinLength = 1;
                }

                if (angular.isUndefined($scope.svgPath)) {
                    $scope.svgPath = "/assets/icons/utility-sprite/svg/symbols.svg";
                }

                //URLs need to be concatenated in controller because concatenation for href is not allowed on view
                $scope.searchSvgUrl = $scope.svgPath + "#search";
                $scope.spinnerSvgUrl = $scope.svgPath + "#spinner";

            }
            $scope.sanitize = function(value) {
            	return $filter('htmlDecode')(value);
            }
            $scope.queryChanged = function () {

                $scope.ngModel = undefined;
                $scope.ngModelDisplay = undefined;

                if ($scope.searchText.length >= $scope.typeaheadMinLength) {
                    cancelPreviousTimeout();

                    timeoutPromise = $timeout($scope.fireSearch, $scope.typeaheadWaitMs);
                }
                else {
                    $scope.dropActive = false;
                    $scope.options = angular.noob;

                }



            }

            $scope.fireSearch = function () {
                $scope.options = angular.noob;
                $timeout(function () { $scope.isLoading = true; $scope.dropActive = true; $scope.noData = false; });
                $scope.typeaheadOptionsMethod({ searchText: $scope.searchText });
            }

            $scope.highlightOption = function (evt) {
                if (angular.isUndefined($scope.options))
                    return;

                if (evt.keyIdentifier == "Down" || (evt.keyCode == 9 && !evt.shiftKey)) {
                    evt.preventDefault();
                    if ($scope.activeIndex < $scope.options.length - 1) {
                        $scope.activeIndex++;
                        $scope.scrollToView();
                    }
                }
                else if (evt.keyIdentifier == "Up" || (evt.keyCode == 9 && evt.shiftKey)) {
                    evt.preventDefault();
                    if ($scope.activeIndex > 0) {
                        $scope.activeIndex--;
                        $scope.scrollToView();
                    }
                }

            }

            $scope.scrollToView = function () {
                var scrollTop = $scope.listElement.scrollTop;
                var listHeight = $scope.listElement.clientHeight;
                var itemHeight = $scope.listElement.querySelector("li").clientHeight;
                var itemsInView = listHeight / itemHeight;

                //if item is not in view, fix the scrolling to bring it in view
                var startIndexInView = scrollTop / itemHeight;
                startIndexInView -= (scrollTop % itemHeight == 0 ? 0 : 1);
                endIndexInView = startIndexInView + itemsInView - 1 - (scrollTop % itemHeight == 0 ? 0 : 1);

                if ($scope.activeIndex < startIndexInView) {
                    scrollTop -= itemHeight * (startIndexInView - $scope.activeIndex - 1) + (scrollTop % itemHeight == 0 ? itemHeight : itemHeight);
                }
                else if ($scope.activeIndex > endIndexInView) {
                    scrollTop += itemHeight * ($scope.activeIndex - endIndexInView) - scrollTop % itemHeight;
                }
                $scope.listElement.scrollTop = scrollTop;
            }

            $document.on('click', function () {


                if ($scope.typeaheadSelectOnBlur && $scope.dropActive) {
                    if (angular.isUndefined($scope.options) || $scope.options.length == 0) {
                        $scope.searchText = "";
                        $scope.destroy();
                        return;
                    }
                    $scope.ngModel = angular.isDefined($scope.valueAttr) ? $scope.options[$scope.activeIndex][$scope.valueAttr] : $scope.options[$scope.activeIndex];
                    $scope.ngModelDisplay = $scope.options[$scope.activeIndex][$scope.nameAttr] ;
                    $timeout(function () { $scope.typeaheadOnSelect(); });
                }
                else if (angular.isUndefined($scope.ngModel)) {
                    $scope.searchText = "";
                }
                $scope.destroy();

            });

            $scope.selectOption = function (option, evt) {
                $scope.ngModel = angular.isDefined($scope.valueAttr) ? option[$scope.valueAttr] : option;
                $scope.ngModelDisplay = $sce.trustAsHtml(option[$scope.nameAttr]);
                $timeout(function () { $scope.typeaheadOnSelect(); });
                $scope.destroy();
                evt.stopPropagation();
            }

            $scope.destroy = function () {
                cancelPreviousTimeout();
                $scope.dropActive = false;
                $scope.options = angular.noob;
                $timeout(function () { $scope.noData = false; });
            }

            $scope.init();
        }
    };
});