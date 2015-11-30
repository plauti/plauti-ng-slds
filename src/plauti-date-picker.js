plautiNgSlds.directive('plautiDatepicker', function ($log, $filter) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        //#region Template
        template:"<div>"
     +"    <div class=\"slds-form-element \">"
     +"        <div class=\"slds-form-element__control slds-size--1-of-1\">"
     +"            <div class=\"slds-input-has-icon slds-input-has-icon--right\">"
     +"                <svg class=\"slds-input__icon slds-icon-text-default\" ng-click=\"toggleCalendar()\" ng-style=\"{cursor:ngDisabled?\'not-allowed\':\'pointer\'}\">"
     +"                    <use xlink:href=\"{{eventSvgUrl}}\"><\/use>"
     +"                <\/svg>"
     +"                <input id=\"date\" class=\"slds-input\" type=\"text\" tabindex=\"{{tabOrder}}\" ng-click=\"toggleCalendar()\" ng-disabled=\"ngDisabled\" ng-readonly=\"true\" placeholder=\"{{dateLabel}}\" \/>"
     +"            <\/div>"
     +"        <\/div>"
     +"    <\/div>"
     +"    <div class=\"slds-dropdown slds-dropdown--left slds-datepicker\" data-selection=\"single\" ng-show=\"calendarVisible\">"
     +"        <div class=\"slds-datepicker__filter slds-grid\">"
     +"            <div class=\"slds-datepicker__filter--month slds-grid slds-grid--align-spread slds-size--3-of-4\">"
     +"                <div class=\"slds-align-middle\">"
     +"                    <button class=\"slds-button slds-button--icon-container\" ng-click=\"prevMonth($event)\">"
     +"                        <svg aria-hidden=\"true\" class=\"slds-button__icon slds-button__icon--small\">"
     +"                            <use xlink:href=\"{{leftSvgUrl}}\"><\/use>"
     +"                        <\/svg>"
     +"                        <span class=\"slds-assistive-text\">Previous Month<\/span>"
     +"                    <\/button>"
     +"                <\/div>"
     + "                <h2 id=\"month\" class=\"slds-align-middle\" aria-live=\"assertive\" aria-atomic=\"true\" ng-click=\"$event.stopPropagation()\">{{months[month]}}<\/h2>"
     +"                <div class=\"slds-align-middle\">"
     +"                    <button class=\"slds-button slds-button--icon-container\" ng-click=\"nextMonth($event)\">"
     +"                        <svg aria-hidden=\"true\" class=\"slds-button__icon slds-button__icon--small\">"
     +"                            <use xlink:href=\"{{rightSvgUrl}}\"><\/use>"
     +"                        <\/svg>"
     +"                        <span class=\"slds-assistive-text\">Next Month<\/span>"
     +"                    <\/button>"
     +"                <\/div>"
     +"            <\/div>"
     +"            <div class=\"slds-picklist slds-picklist--fluid slds-shrink-none\">"
     +"                <select ng-model=\"year\" class=\"slds-select slds-button--neutral slds-picklist__label\"  ng-options=\"year for year in years\" ng-click=\"$event.stopPropagation()\" ng-change=\"yearChanged()\"><\/select>"
     +"            <\/div>"
     +"        <\/div>"
     +"        <table class=\"datepicker__month\" role=\"grid\" aria-labelledby=\"month\">"
     +"            <thead>"
     +"                <tr id=\"weekdays\">"
     +"                    <th id=\"Sunday\">"
     +"                        <abbr title=\"Sunday\">S<\/abbr>"
     +"                    <\/th>"
     +"                    <th id=\"Monday\">"
     +"                        <abbr title=\"Monday\">M<\/abbr>"
     +"                    <\/th>"
     +"                    <th id=\"Tuesday\">"
     +"                        <abbr title=\"Tuesday\">T<\/abbr>"
     +"                    <\/th>"
     +"                    <th id=\"Wednesday\">"
     +"                        <abbr title=\"Wednesday\">W<\/abbr>"
     +"                    <\/th>"
     +"                    <th id=\"Thursday\">"
     +"                        <abbr title=\"Thursday\">T<\/abbr>"
     +"                    <\/th>"
     +"                    <th id=\"Friday\">"
     +"                        <abbr title=\"Friday\">F<\/abbr>"
     +"                    <\/th>"
     +"                    <th id=\"Saturday\">"
     +"                        <abbr title=\"Saturday\">S<\/abbr>"
     +"                    <\/th>"
     +"                <\/tr>"
     +"            <\/thead>"
     +"            <tbody>"
     +"                <tr ng-repeat=\"week in weeks\"><td ng-repeat=\"date in week\" ng-class=\"getDateClass(date)\" ng-click=\"selectDate(date,$event)\" role=\"gridcell\" aria-disabled=\"{{date.secondary}}\"><span class=\"slds-day\">{{date.date}}<\/span><\/td><\/tr>"
     +"            <\/tbody>"
     +"        <\/table>"
     +"    <\/div>"
     + "<\/div>",
        //#endregion
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            ngChange: '&',
            startYear: '@',
            endYear: '@',
            required: '@',
            tabOrder:'=',
            svgPath: '@',
            dateFormat:'@'
        },
        link: function ($scope, iElm, iAttr, mdlCtrl) {
           


            $scope.$watch('ngModel', function (value) {



                if (angular.isDefined(value)&&!angular.isDate(value)) {
                    $log.error("Plauti-Datepicker: ng-model needs to be a valid Date object");
                    return;
                }

                if (value == undefined && $scope.required) {
                    mdlCtrl.$setValidity("required", false);
                }
                else {
                    mdlCtrl.$setValidity("required", true);
                }

                if (angular.isDefined(value)) {
                    $scope.dateLabel = $filter('date')(value, $scope.dateFormat);
                    if(value.getYear()!=$scope.activeDate.getYear()||value.getMonth()!=$scope.activeDate.getMonth())
                    {
                        var newActiveDate = new Date();
                        newActiveDate.setYear(value.getFullYear());
                        newActiveDate.setMonth(value.getMonth());
                        $scope.activeDate = newActiveDate;
                    }
                }
                else
                {
                    $scope.dateLabel = $scope.datePlaceholderText;
                }
            });

        },
        controller: function ($scope, $document, $timeout, $filter) {
            

            $scope.init = function () {
                $scope.months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                $scope.calendarVisible = false;
                $scope.activeDate = new Date();
                $scope.month = $scope.activeDate.getMonth();
                $scope.year = $scope.activeDate.getFullYear();
                $scope.weeks = $scope.getWeeksOfMonth($scope.activeDate);
                $scope.populateYears();
                $scope.datePlaceholderText = "Pick a Date";
                if (angular.isUndefined($scope.svgPath)) {
                    $scope.svgPath = "/assets/icons/utility-sprite/svg/symbols.svg";
                }

                //URLs need to be concatenated in controller because concatenation for href is not allowed on view
                $scope.leftSvgUrl = $scope.svgPath + "#left";
                $scope.rightSvgUrl = $scope.svgPath + "#right";
                $scope.eventSvgUrl = $scope.svgPath + "#event";

                //set default date format
                if(angular.isUndefined($scope.dateFormat))
                {
                    $scope.dateFormat = 'MM/dd/yyyy';
                }
            }

            $scope.toggleCalendar = function (evt) {
                if ($scope.ngDisabled)
                    return;
                //This is to tackle multiple calendars on a single page. This will avoid multiple calendars to be visible simultaneously, thus avoiding overlap issues!
                var visibilityToSet = !$scope.calendarVisible;
                $timeout(function () { $scope.calendarVisible = visibilityToSet });
            }

            $document.on('click', function () {
                $scope.$apply(function () { $scope.calendarVisible = false; });
            });

            $scope.$watch('activeDate', function () {
                $scope.month = $scope.activeDate.getMonth();
                $scope.year = $scope.activeDate.getFullYear();
                $scope.weeks = $scope.getWeeksOfMonth($scope.activeDate);
            });

            $scope.nextMonth = function (evt) {
                evt.stopPropagation();
                $scope.activeDate = new Date($scope.activeDate.setMonth($scope.activeDate.getMonth() + 1));

            }

            $scope.prevMonth = function (evt) {
                evt.stopPropagation();
                $scope.activeDate = new Date($scope.activeDate.setMonth($scope.activeDate.getMonth() - 1));

            }

            $scope.yearChanged = function () {
                $scope.activeDate = new Date($scope.activeDate.setYear($scope.year));
            }

            $scope.selectDate = function (date,evt) {
               
                if (!angular.equals($scope.ngModel, date) && !date.secondary)
                {
                    $scope.ngModel = date;
                    $timeout(function () { $scope.ngChange(); });
                }
                else
                {
                    evt.stopPropagation();
                }
            }

            $scope.getDateClass = function (date) {
                var cls = "";
                if (angular.equals($scope.ngModel, date))
                {
                    cls += "slds-is-selected";
                }
                if (date.secondary) {
                    cls += ' slds-disabled-text';
                }
                return cls;
            }



            $scope.getWeeksOfMonth = function (activeDate) {

                var year = activeDate.getFullYear(),
                  month = activeDate.getMonth(),
                  firstDayOfMonth = new Date(year, month, 1),
                  lastDayOfMonth = new Date(year, month, getDaysInMonth(year, month)),
                  numDisplayedFromPreviousMonth = firstDayOfMonth.getDay(),
                  numDisplayedFromNextMonth = 6 - lastDayOfMonth.getDay(),
                  totalDaysToDisplay = numDisplayedFromPreviousMonth + getDaysInMonth(year, month) + numDisplayedFromNextMonth,
                  firstDate = new Date(firstDayOfMonth);

                if (numDisplayedFromPreviousMonth > 0) {
                    firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
                }

                var days = getDates(firstDate, totalDaysToDisplay);
                for (var i = 0; i < totalDaysToDisplay; i++) {
                    days[i] = angular.extend(days[i], {
                        secondary: days[i].getMonth() !== month,
                        date: days[i].getDate()
                    });
                }
                return splitArray(days, 7);
            }

            $scope.populateYears = function () {
                $scope.years = [];
                var startYear = 2000;
                var endYear = 2099;
                if (angular.isDefined($scope.startYear))
                {
                    startYear = parseInt($scope.startYear);
                }
                if (angular.isDefined($scope.endYear)) {
                    endYear = parseInt($scope.endYear);
                }
                for (var i = startYear; i <= endYear; i++) {
                    $scope.years.push(i);
                }
            }



            $scope.init();

            //#region ==Private Functions==

            function getDaysInMonth(year, month) {
                var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
            }

            function getDates(startDate, n) {
                var dates = new Array(n), current = new Date(startDate), i = 0, date;
                while (i < n) {
                    date = new Date(current);
                    dates[i++] = date;
                    current.setDate(current.getDate() + 1);
                }
                return dates;
            }

            function fixTimeZone(date) {
                return new Date(date.setMinutes(date.getMinutes() - new Date().getTimezoneOffset()));
            }

            function splitArray(arr, size) {
                var arrays = [];
                while (arr.length > 0) {
                    arrays.push(arr.splice(0, size));
                }
                return arrays;
            };

            //#endregion
            
        }
    };

});