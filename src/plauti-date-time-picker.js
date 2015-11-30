plautiNgSlds.directive('plautiDatetimepicker', function ($log,$timeout) {

    return {
        restrict:'E',
        replace: true,
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            ngChange: '&',
            startYear: '@',
            endYear: '@',
            required: '@',
            svgPath: '@',
            tabOrder: '=',
            isMeridianFormat: '=',
            minStep: '=',
            name: '@',
            dateFormat: '@'

        },
        template: "<div class=\"slds-form--compound\"><div class=\"slds-form-element__row\">"
            + "<plauti-datepicker class=\"slds-form-element__control slds-size--2-of-3\" style=\"vertical-align:top\" ng-model=\"datepart\" ng-disabled=\"ngDisabled\" name=\"{{name+'-date'}}\" ng-change=\"dateChanged()\" start-year=\"{{startYear}}\" end-year=\"{{endYear}}\" svg-path=\"{{svgPath}}\" date-format=\"{{dateFormat}}\"></plauti-datepicker>"
            + "<plauti-timepicker class=\"slds-form-element__control slds-size--1-of-3\" ng-model=\"timepart\" ng-disabled=\"ngDisabled\" is-meridian-format=\"isMeridianFormat\" name=\"{{name+'-time'}}\" min-step=\"minStep\" ng-change=\"timeChanged()\"></plauti-timepicker>"
            + "</div></div>",
        link:function($scope, iElm, iAttr, mdlCtrl)
        {
            $scope.$watch('ngModel', function (value) {

                if (angular.isDefined(value) && !angular.isDate(value)) {
                    $log.error("Plauti-Datetimepicker: ng-model needs to be a valid Date object");
                    return;
                }

                if (value == undefined && $scope.required) {
                    mdlCtrl.$setValidity("required", false);
                }
                else {
                    mdlCtrl.$setValidity("required", true);
                }

                $scope.datepart = $scope.ngModel;
                $scope.timepart = $scope.ngModel;
            });

            $scope.dateChanged = function () {
                var newDateTime = angular.copy($scope.datepart);
                newDateTime.setHours($scope.timepart.getHours(), $scope.timepart.getMinutes(), 0, 0);
                $scope.ngModel = newDateTime;
                $timeout(function () { $scope.ngChange(); });
            };

            $scope.timeChanged = function () {
                if(angular.isDefined($scope.datepart))
                {
                    var newDateTime = angular.copy($scope.datepart);
                    newDateTime.setHours($scope.timepart.getHours(), $scope.timepart.getMinutes(), 0, 0);
                    $scope.ngModel = newDateTime;
                    $timeout(function () { $scope.ngChange(); });
                }
            };


        }

    };

});