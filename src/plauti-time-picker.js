plautiNgSlds.directive('plautiTimepicker', function ($log,$filter) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        template: '<div><select class="slds-select" tabindex="{{tabOrder}}" ng-disabled="ngDisabled" ng-change="selectedTimeChanged()" ng-style="{\'padding-left\':isMeridianFormat?\'2rem\':\'3rem\'}" ng-model="selectedTime" ng-options="time.title for time in times"/></div>',
        scope: {
            isMeridianFormat: '=',
            minStep: '=',
            ngModel: '=',
            ngDisabled: '=',
            tabOrder:'=',
            ngChange:'&'
        },
        link: function ($scope, iElm, iAttr, mdlCtrl) {
            var today = new Date();
         

            $scope.$watch('ngModel', function (value) {
                if (angular.isUndefined(value)) {
                    today.setHours(0, 0, 0, 0);
                    $scope.ngModel = angular.copy(today);
                    return;
                }

                if (!angular.isDate(value)) {
                    $log.error("Plauti-Timepicker: ng-model needs to be a valid Date object");
                    return;
                }

                var hours = value.getHours();
                var minutes = value.getMinutes();

                //if time being set does not match with any time option, set it to the floor value
                if (minutes % $scope.appliedMinStep != 0) {
                    minutes = minutes - minutes % $scope.appliedMinStep;
                    today.setHours(hours, minutes, 0, 0);
                    $scope.ngModel = angular.copy(today);
                    return;
                }

                today.setHours(hours, minutes, 0, 0);

                var filteredTime = $filter('filter')($scope.times, function (value, index, array) { if (angular.equals(value.value, today)) return true; });
                if (!angular.isUndefined(filteredTime) && filteredTime.length == 1) {
                    $scope.selectedTime = filteredTime[0];
                }
            });

        },
        controller: function ($scope,$timeout) {
            var today = new Date();
            var time = new Date();
            var min = 0;
            
            $scope.appliedMinStep = 30;
            if (angular.isDefined($scope.minStep) && 60 % $scope.minStep != 0) {
                $log.error("Plauit-Timepicker: 60 should be divisible by min-step");
            }
            else if (angular.isDefined($scope.minStep)) {
                $scope.appliedMinStep = angular.copy($scope.minStep);
            };

            $scope.init = function () {
              
                $scope.times = [];
                time.setHours(0, min, 0, 0);
                do {

                    var timeInfo = { title: getTimeFormatString(time), value: angular.copy(time) };
                    $scope.times.push(timeInfo);
                    min += $scope.appliedMinStep;
                    time.setHours(0, min, 0, 0);
                } while (today.getDate() == time.getDate());

            };

            $scope.selectedTimeChanged = function () {
                $scope.ngModel = $scope.selectedTime.value;
                $timeout(function () { $scope.ngChange(); });
            };

            function getTimeFormatString(datetime) {
                var hours = datetime.getHours();
                var minutes = datetime.getMinutes();

                var AMPM = "";

                if ($scope.isMeridianFormat) {
                    if (hours == 0) {
                        hours = 12;
                        AMPM = "am";
                    }
                    else if (hours < 12) {
                        AMPM = "am";
                    }
                    else if (hours == 12) {
                        AMPM = "pm";
                    }
                    else if (hours > 12) {
                        hours -= 12;
                        AMPM = "pm";
                    }
                }
                else if (hours < 10)
                    hours = "0" + hours;



                if (minutes < 10) minutes = "0" + minutes;

                return hours + ":" + minutes + AMPM;
            }

            $scope.init();

        
        }
    };

});