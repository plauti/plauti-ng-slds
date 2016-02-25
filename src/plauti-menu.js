plautiNgSlds.directive('plautiMenu', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude:true,
        template:"<div>"
   +"    <div ng-class=\"{'slds-dropdown-trigger':!ngDisabled}\">"
   +"        <button class=\"slds-button \" ng-class=\"{'slds-button--icon-x-small': menuSize=='small', 'slds-button--icon-border-filled': !isInverse, 'slds-button--inverse' : isInverse}\" style=\"width: auto; padding: 0 4px;\" ng-disabled=\"ngDisabled\">"
   +"            <span ng-bind-html=\"menuTitle\"/>"
   +"            <svg aria-hidden=\"true\" class=\"slds-button__icon\" ng-class=\"{'slds-button__icon--small': menuSize=='small', 'slds-button__icon--hint': !isInverse, 'slds-button--icon-inverse' : isInverse}\" ng-show=\"menuIconVisible\">"
   +"                <use xlink:href=\"{{menuIconPath}}\"><\/use>"
   +"            <\/svg>"
   +"        <\/button>"
   +""
   +"        <div class=\"slds-dropdown slds-dropdown--menu\" ng-class=\"getClass()\" ng-hide=\"ngDisabled\">"
   +"            <ul class=\"slds-dropdown__list\" role=\"menu\" ng-transclude>"
   +"            <\/ul>"
   +"        <\/div>"
   +"    <\/div>"
   +"<\/div>",

        scope: {
            menuTitle: '@',
            menuIcon: '@',
            svgPath: '@',
            ngDisabled: '=',
            position: '@',
            menuSize: '@',
            inverse: '@'
        },
        link: function (scope, element, attrs) {

        },
        controller: function ($scope, $location, $window) {
            $scope.init = function () {
                if (angular.isUndefined($scope.svgPath)) {
                    $scope.svgPath = "/assets/icons/utility-sprite/svg/symbols.svg";
                };

                if (angular.isDefined($scope.menuIcon)) {
                    $scope.menuIconVisible = true;
                    $scope.menuIconPath = $scope.svgPath + "#" + $scope.menuIcon;
                };
                
                if (angular.isDefined($scope.inverse) && $scope.inverse) {
                	$scope.isInverse = true;
                } else {
                	$scope.isInverse = false;
                };
                
                if (angular.isUndefined($scope.menuSize)) {
                	$scope.menuSize="normal";
                };
            };

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

                };
            };

            $scope.init();
        }
    };
});

plautiNgSlds.directive('plautiMenuItem', function ($timeout,$window) {
    return {
        restrict: 'E',
        replace: true,
        require: '^plautiMenu',
        scope: {
            title: '@',
            action: '@',
            actionType: '@',
            iconurl: '@',
            href: '@',
            uiSref:'@'
        },
        link: function ($scope, element, attrs, menuController) {
		
            if(angular.isUndefined($scope.href))
            {
                $scope.href = "javascript:void(0);"
            }

        },
        template:  "<li class=\"slds-dropdown__item\" >"
   +"                    <a href=\"{{href}}\">"
   +"                        <p class=\"slds-truncate\">{{title}}<\/p>"
   +"                        <svg aria-hidden=\"true\" class=\"slds-icon slds-icon--x-small slds-icon-text-default slds-m-left--small slds-shrink-none\" ng-hide=\"iconurl==undefined\">"
   +"                            <use xlink:href=\"{{iconurl}}\"><\/use>"
   +"                        <\/svg>"
   +"                    <\/a>"
   +"                <\/li>"

    };
});