define(function (require) {
  var html = require('text!partials/timepicker.html');
  var module = require('modules').get('kibana/directives');
  var _ = require('lodash');
  var datemath = require('utils/datemath');
  var moment = require('moment');

  module.directive('kbnTimepicker', function () {
    return {
      restrict: 'E',
      scope: {
        from: '=',
        to: '=',
        mode: '='
      },
      template: html,
      controller: function ($scope) {

        var init = function () {
          $scope.formatRelative();
        };

        $scope.format = 'MMMM Do YYYY, HH:mm:ss.SSS';
        $scope.modes = ['quick', 'relative', 'absolute'];

        $scope.relative = {
          count: 1,
          unit: 'm',
          preview: undefined,
          round: false
        };

        $scope.units = {
          s: 'second',
          m: 'minute',
          h: 'hour',
          d: 'day',
          w: 'week',
          M: 'month',
          y: 'year'
        };

        $scope.relativeOptions = [
          {text: 'Seconds ago', value: 's'},
          {text: 'Minutes ago', value: 'm'},
          {text: 'Hours ago', value: 'h'},
          {text: 'Days ago', value: 'd'},
          {text: 'Weeks ago', value: 'w'},
          {text: 'Months ago', value: 'M'},
          {text: 'Years ago', value: 'y'},
        ];

        if (_.isUndefined($scope.mode)) $scope.mode = 'quick';

        $scope.setMode = function (thisMode) {
          switch (thisMode) {
          case 'quick':
            break;
          case 'relative':
            var duration = moment.duration(moment().diff($scope.from));
            var units = _.pluck(_.clone($scope.relativeOptions).reverse(), 'value');
            for (var i = 0; i < units.length; i++) {
              var as = duration.as(units[i]);
              if (as > 1) {
                $scope.relative.count = Math.round(as);
                $scope.relative.unit = units[i];
                break;
              }
            }
            break;
          case 'absolute':
            break;
          }

          $scope.mode = thisMode;
        };

        $scope.setQuick = function (from, to) {
          $scope.from = datemath.parse(from);
          $scope.to = datemath.parse(to, true);
        };

        $scope.formatRelative = function () {
          var parsed = datemath.parse('now-' + $scope.relative.count + $scope.relative.unit +
            ($scope.relative.round ? '/' + $scope.relative.unit: ''));
          $scope.relative.preview =  parsed ? parsed.format($scope.format) : undefined;
          return parsed;
        };

        $scope.applyRelative = function () {
          $scope.from = $scope.formatRelative();
          $scope.to = datemath.parse('now', $scope.relative.round);
        };

        init();
      }
    };
  });

});