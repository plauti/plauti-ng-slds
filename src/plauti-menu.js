plautiNgSlds.directive('plautiMenu', function () {
    return {
        restrict: 'E',
        replace: true,
        template:"<div>"
   +"    <div ng-class=\"{'slds-dropdown-trigger':!ngDisabled}\">"
   +"        <button class=\"slds-button slds-button--icon-border-filled\" style=\"width: auto; padding: 0 4px;\" ng-disabled=\"ngDisabled\">"
   +"            <span>{{menuTitle}}<\/span>"
   +"            <svg aria-hidden=\"true\" class=\"slds-button__icon slds-button__icon--hint\" ng-show=\"menuIconVisible\">"
   +"                <use xlink:href=\"{{menuIconPath}}\"><\/use>"
   +"            <\/svg>"
   +"        <\/button>"
   +""
   +"        <div class=\"slds-dropdown slds-dropdown--menu\" ng-class=\"getClass()\" ng-hide=\"ngDisabled\">"
   +"            <ul class=\"slds-dropdown__list\" role=\"menu\" data-reactid=\".8.0.1.0\">"
   +"                <li class=\"slds-dropdown__item\" ng-repeat=\"menuItem in menuItems\" ng-click=\"$parent.performAction(menuItem.action)\">"
   +"                    <a href=\"javascript:void(0)\">"
   +"                        <p class=\"slds-truncate\">{{menuItem.name}}<\/p>"
   +"                        <svg aria-hidden=\"true\" class=\"slds-icon slds-icon--x-small slds-icon-text-default slds-m-left--small slds-shrink-none\" ng-hide=\"menuItem.iconurl==undefined\">"
   +"                            <use xlink:href=\"{{menuItem.iconurl}}\"><\/use>"
   +"                        <\/svg>"
   +"                    <\/a>"
   +"                <\/li>"
   +"            <\/ul>"
   +"        <\/div>"
   +"    <\/div>"
   +"<\/div>",

        scope: {
            menuTitle: '@',
            menuIcon: '@',
            menuItems: '=',
            svgPath: '@',
            ngDisabled: '=',
            position: '@',
            actionType: '@'
        },
        link: function (scope, element, attrs) {

        },
        controller: function ($scope, $location, $window) {
            $scope.init = function () {
                if (angular.isUndefined($scope.svgPath)) {
                    $scope.svgPath = "/assets/icons/utility-sprite/svg/symbols.svg";
                }

                if (angular.isDefined($scope.menuIcon)) {
                    $scope.menuIconVisible = true;
                    $scope.menuIconPath = $scope.svgPath + "#" + $scope.menuIcon;
                }
            }

            $scope.getClass = function () {
                switch ($scope.position) {
                    case 'topLeft':
                        return 'slds-dropdown--bottom slds-dropdown--left';
                    case 'topMiddle':
                        return 'slds-dropdown--bottom';
                    case 'topRight':
                        return 'slds-dropdown--bottom slds-dropdown--right';
                    case 'bottomLeft':
                        return 'slds-dropdown--left';
                    case 'bottomMiddle':
                        return '';
                    case 'bottomRight':
                        return 'slds-dropdown--right';

                }
            }

            $scope.performAction = function (action) {
                switch ($scope.actionType) {
                    case 'link':
                        $window.location.href = action;
                    case 'click':
                        $scope.$parent.$eval(action+"()", {});
                }
            }

            $scope.init();
        }
    };
});
