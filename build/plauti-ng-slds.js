/*! plauti-ng-slds 0.0.1 2016-02-25 GPL-3.0 
Angular Directives for Lightning Design System */
var plautiNgSlds = angular.module("plauti-ng-slds", []);
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
/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
plautiNgSlds.factory('$$stackedMap', function () {
    return {
        createNew: function () {
            var stack = [];

            return {
                add: function (key, value) {
                    stack.push({
                        key: key,
                        value: value
                    });
                },
                get: function (key) {
                    for (var i = 0; i < stack.length; i++) {
                        if (key == stack[i].key) {
                            return stack[i];
                        }
                    }
                },
                keys: function() {
                    var keys = [];
                    for (var i = 0; i < stack.length; i++) {
                        keys.push(stack[i].key);
                    }
                    return keys;
                },
                top: function () {
                    return stack[stack.length - 1];
                },
                remove: function (key) {
                    var idx = -1;
                    for (var i = 0; i < stack.length; i++) {
                        if (key == stack[i].key) {
                            idx = i;
                            break;
                        }
                    }
                    return stack.splice(idx, 1)[0];
                },
                removeTop: function () {
                    return stack.splice(stack.length - 1, 1)[0];
                },
                length: function () {
                    return stack.length;
                }
            };
        }
    };
})

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
.directive('modalBackdrop', [
         '$animate', '$modalStack',
function ($animate ,  $modalStack) {
    return {
        restrict: 'EA',
        replace: true,
        template: "<div aria-hidden=\"false\" role=\"dialog\" class=\"slds-modal slds-modal--large slds-fade-in-open-backdrop ng-scope\" ></div>\n" +
    "",
        compile: function (tElement, tAttrs) {
            tElement.addClass(tAttrs.backdropClass);
            return linkFn;
        }
    };

    function linkFn(scope, element, attrs) {
        if (attrs.modalInClass) {
            $animate.addClass(element, attrs.modalInClass);

            scope.$on($modalStack.NOW_CLOSING_EVENT, function (e, setIsAsync) {
                var done = setIsAsync();
                $animate.removeClass(element, attrs.modalInClass).then(done);
            });
        }
    }
}])

.directive('modalWindow', [
         '$modalStack', '$q', '$animate',
function ($modalStack ,  $q ,  $animate) {
    return {
        restrict: 'EA',
        scope: {
            index: '@'
        },
        replace: true,
        transclude: true,
        template:"<div modal-render=\"{{$isRendered}}\" tabindex=\"-1\" aria-hidden=\"false\" role=\"dialog\" ng-class=\"size ? 'slds-modal--' + size : ''\" class=\"slds-modal slds-fade-in-open ng-scope\" ><div class=\"slds-modal__container\" modal-transclude></div></div>",

    //        "<div modal-render=\"{{$isRendered}}\" tabindex=\"-1\" role=\"dialog\" class=\"modal\"\n" +
    //"    modal-animation-class=\"fade\"\n" +
    //"    modal-in-class=\"in\"\n" +
    //"	ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
    //"    <div class=\"modal-dialog\" ng-class=\"size ? 'modal-' + size : ''\"><div class=\"modal-content\" modal-transclude></div></div>\n" +
    //"</div>\n" +
    //"",
        link: function (scope, element, attrs) {
            element.addClass(attrs.windowClass || '');
            scope.size = attrs.size;

            scope.close = function (evt) {
                var modal = $modalStack.getTop();
                if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    $modalStack.dismiss(modal.key, 'backdrop click');
                }
            };

            // This property is only added to the scope for the purpose of detecting when this directive is rendered.
            // We can detect that by using this property in the template associated with this directive and then use
            // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
            scope.$isRendered = true;

            // Deferred object that will be resolved when this modal is render.
            var modalRenderDeferObj = $q.defer();
            // Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
            // In order to use this way of finding whether DOM is ready, we need to observe a scope property used in modal's template.
            attrs.$observe('modalRender', function (value) {
                if (value == 'true') {
                    modalRenderDeferObj.resolve();
                }
            });

            modalRenderDeferObj.promise.then(function () {
                if (attrs.modalInClass) {
                    $animate.addClass(element, attrs.modalInClass);

                    scope.$on($modalStack.NOW_CLOSING_EVENT, function (e, setIsAsync) {
                        var done = setIsAsync();
                        $animate.removeClass(element, attrs.modalInClass).then(done);
                    });
                }

                var inputsWithAutofocus = element[0].querySelectorAll('[autofocus]');
                /**
                 * Auto-focusing of a freshly-opened modal element causes any child elements
                 * with the autofocus attribute to lose focus. This is an issue on touch
                 * based devices which will show and then hide the onscreen keyboard.
                 * Attempts to refocus the autofocus element via JavaScript will not reopen
                 * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                 * the modal element if the modal does not contain an autofocus element.
                 */
                if (inputsWithAutofocus.length) {
                    inputsWithAutofocus[0].focus();
                } else {
                    element[0].focus();
                }

                // Notify {@link $modalStack} that modal is rendered.
                var modal = $modalStack.getTop();
                if (modal) {
                    $modalStack.modalRendered(modal.key);
                }
            });
        }
    };
}])

.directive('modalAnimationClass', [
  function () {
      return {
          compile: function (tElement, tAttrs) {
              if (tAttrs.modalAnimation) {
                  tElement.addClass(tAttrs.modalAnimationClass);
              }
          }
      };
  }])

.directive('modalTransclude', function () {
    return {
        link: function($scope, $element, $attrs, controller, $transclude) {
            $transclude($scope.$parent, function(clone) {
                $element.empty();
                $element.append(clone);
            });
        }
    };
})

.factory('$modalStack', [
           '$animate', '$timeout', '$document', '$compile', '$rootScope',
           '$q',
           '$$stackedMap',
  function ($animate ,  $timeout ,  $document ,  $compile ,  $rootScope ,
            $q,
            $$stackedMap) {

      var OPENED_MODAL_CLASS = 'modal-open';

      var backdropDomEl, backdropScope;
      var openedWindows = $$stackedMap.createNew();
      var $modalStack = {
          NOW_CLOSING_EVENT: 'modal.stack.now-closing'
      };

      function backdropIndex() {
          var topBackdropIndex = -1;
          var opened = openedWindows.keys();
          for (var i = 0; i < opened.length; i++) {
              if (openedWindows.get(opened[i]).value.backdrop) {
                  topBackdropIndex = i;
              }
          }
          return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex){
          if (backdropScope) {
              backdropScope.index = newBackdropIndex;
          }
      });

      function removeModalWindow(modalInstance, elementToReceiveFocus) {

          var body = $document.find('body').eq(0);
          var modalWindow = openedWindows.get(modalInstance).value;

          //clean up the stack
          openedWindows.remove(modalInstance);

          removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, function() {
              body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
              checkRemoveBackdrop();
          });

          //move focus to specified element if available, or else to body
          if (elementToReceiveFocus && elementToReceiveFocus.focus) {
              elementToReceiveFocus.focus();
          } else {
              body.focus();
          }
      }

      function checkRemoveBackdrop() {
          //remove backdrop if no longer needed
          if (backdropDomEl && backdropIndex() == -1) {
              var backdropScopeRef = backdropScope;
              removeAfterAnimate(backdropDomEl, backdropScope, function () {
                  backdropScopeRef = null;
              });
              backdropDomEl = undefined;
              backdropScope = undefined;
          }
      }

      function removeAfterAnimate(domEl, scope, done) {
          var asyncDeferred;
          var asyncPromise = null;
          var setIsAsync = function () {
              if (!asyncDeferred) {
                  asyncDeferred = $q.defer();
                  asyncPromise = asyncDeferred.promise;
              }

              return function asyncDone() {
                  asyncDeferred.resolve();
              };
          };
          scope.$broadcast($modalStack.NOW_CLOSING_EVENT, setIsAsync);

          // Note that it's intentional that asyncPromise might be null.
          // That's when setIsAsync has not been called during the
          // NOW_CLOSING_EVENT broadcast.
          return $q.when(asyncPromise).then(afterAnimating);

          function afterAnimating() {
              if (afterAnimating.done) {
                  return;
              }
              afterAnimating.done = true;

              domEl.remove();
              scope.$destroy();
              if (done) {
                  done();
              }
          }
      }

      $document.bind('keydown', function (evt) {
          var modal;

          if (evt.which === 27) {
              modal = openedWindows.top();
              if (modal && modal.value.keyboard) {
                  evt.preventDefault();
                  $rootScope.$apply(function () {
                      $modalStack.dismiss(modal.key, 'escape key press');
                  });
              }
          }
      });

      $modalStack.open = function (modalInstance, modal) {

          var modalOpener = $document[0].activeElement;

          openedWindows.add(modalInstance, {
              deferred: modal.deferred,
              renderDeferred: modal.renderDeferred,
              modalScope: modal.scope,
              backdrop: modal.backdrop,
              keyboard: modal.keyboard
          });

          var parentEl = $document.find('body').eq(0),
              currBackdropIndex = backdropIndex();
          if (angular.isDefined(modal.appendTo) && angular.isElement(modal.appendTo)) {
              parentEl = modal.appendTo;
          }

          if (currBackdropIndex >= 0 && !backdropDomEl) {
              backdropScope = $rootScope.$new(true);
              backdropScope.index = currBackdropIndex;
              var angularBackgroundDomEl = angular.element('<div modal-backdrop="modal-backdrop"></div>');
              angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
              if (modal.animation) {
                  angularBackgroundDomEl.attr('modal-animation', 'true');
              }
              backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
              parentEl.append(backdropDomEl);
          }

          var angularDomEl = angular.element('<div modal-window="modal-window"></div>');
          angularDomEl.attr({
              'template-url': modal.windowTemplateUrl,
              'window-class': modal.windowClass,
              'size': modal.size,
              'index': openedWindows.length() - 1,
              'animate': 'animate'
          }).html(modal.content);
          if (modal.animation) {
              angularDomEl.attr('modal-animation', 'true');
          }

          var modalDomEl = $compile(angularDomEl)(modal.scope);
          openedWindows.top().value.modalDomEl = modalDomEl;
          openedWindows.top().value.modalOpener = modalOpener;
          parentEl.append(modalDomEl);
          parentEl.addClass(OPENED_MODAL_CLASS);
      };

      function broadcastClosing(modalWindow, resultOrReason, closing) {
          return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
      }

      $modalStack.close = function (modalInstance, result) {
          var modalWindow = openedWindows.get(modalInstance);
          if (modalWindow && broadcastClosing(modalWindow, result, true)) {
              modalWindow.value.deferred.resolve(result);
              removeModalWindow(modalInstance, modalWindow.value.modalOpener);
              return true;
          }
          return !modalWindow;
      };

      $modalStack.dismiss = function (modalInstance, reason) {
          var modalWindow = openedWindows.get(modalInstance);
          if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
              modalWindow.value.deferred.reject(reason);
              removeModalWindow(modalInstance, modalWindow.value.modalOpener);
              return true;
          }
          return !modalWindow;
      };

      $modalStack.dismissAll = function (reason) {
          var topModal = this.getTop();
          while (topModal && this.dismiss(topModal.key, reason)) {
              topModal = this.getTop();
          }
      };

      $modalStack.getTop = function () {
          return openedWindows.top();
      };

      $modalStack.modalRendered = function (modalInstance) {
          var modalWindow = openedWindows.get(modalInstance);
          if (modalWindow) {
              modalWindow.value.renderDeferred.resolve();
          }
      };

      return $modalStack;
  }])

.provider('$modal', function () {

    var $modalProvider = {
        options: {
            animation: true,
            backdrop: true, //can also be false or 'static'
            keyboard: true
        },
        $get: ['$injector', '$rootScope', '$q', '$templateRequest', '$controller', '$modalStack',
          function ($injector, $rootScope, $q, $templateRequest, $controller, $modalStack) {

              var $modal = {};

              function getTemplatePromise(options) {
                  return options.template ? $q.when(options.template) :
                    $templateRequest(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl);
              }

              function getResolvePromises(resolves) {
                  var promisesArr = [];
                  angular.forEach(resolves, function (value) {
                      if (angular.isFunction(value) || angular.isArray(value)) {
                          promisesArr.push($q.when($injector.invoke(value)));
                      }
                  });
                  return promisesArr;
              }

              $modal.open = function (modalOptions) {

                  var modalResultDeferred = $q.defer();
                  var modalOpenedDeferred = $q.defer();
                  var modalRenderDeferred = $q.defer();

                  //prepare an instance of a modal to be injected into controllers and returned to a caller
                  var modalInstance = {
                      result: modalResultDeferred.promise,
                      opened: modalOpenedDeferred.promise,
                      rendered: modalRenderDeferred.promise,
                      close: function (result) {
                          return $modalStack.close(modalInstance, result);
                      },
                      dismiss: function (reason) {
                          return $modalStack.dismiss(modalInstance, reason);
                      }
                  };

                  //merge and clean up options
                  modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
                  modalOptions.resolve = modalOptions.resolve || {};

                  //verify options
                  if (!modalOptions.template && !modalOptions.templateUrl) {
                      throw new Error('One of template or templateUrl options is required.');
                  }

                  var templateAndResolvePromise =
                    $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


                  templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

                      var modalScope = (modalOptions.scope || $rootScope).$new();
                      modalScope.$close = modalInstance.close;
                      modalScope.$dismiss = modalInstance.dismiss;

                      var ctrlInstance, ctrlLocals = {};
                      var resolveIter = 1;

                      //controllers
                      if (modalOptions.controller) {
                          ctrlLocals.$scope = modalScope;
                          ctrlLocals.$modalInstance = modalInstance;
                          angular.forEach(modalOptions.resolve, function (value, key) {
                              ctrlLocals[key] = tplAndVars[resolveIter++];
                          });

                          ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                          if (modalOptions.controllerAs) {
                              if (modalOptions.bindToController) {
                                  angular.extend(modalScope, ctrlInstance);
                              } else {
                                  modalScope[modalOptions.controllerAs] = ctrlInstance;
                              }
                          }
                      }

                      $modalStack.open(modalInstance, {
                          scope: modalScope,
                          deferred: modalResultDeferred,
                          renderDeferred: modalRenderDeferred,
                          content: tplAndVars[0],
                          animation: modalOptions.animation,
                          backdrop: modalOptions.backdrop,
                          keyboard: modalOptions.keyboard,
                          backdropClass: modalOptions.backdropClass,
                          windowClass: modalOptions.windowClass,
                          windowTemplateUrl: modalOptions.windowTemplateUrl,
                          size: modalOptions.size,
                          appendTo: modalOptions.appendTo
                      });

                  }, function resolveError(reason) {
                      modalResultDeferred.reject(reason);
                  });

                  templateAndResolvePromise.then(function () {
                      modalOpenedDeferred.resolve(true);
                  }, function (reason) {
                      modalOpenedDeferred.reject(reason);
                  });

                  return modalInstance;
              };

              return $modal;
          }]
    };

    return $modalProvider;
});
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
                    $scope.activeTab = tab.name;
                }
                else if (tab.name == $scope.activeTab) {
                	$scope.activeTab = tab.name;
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