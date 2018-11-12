/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"/>
/// <reference path="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"/>

var Timer = function () {

    var twentyFiveMinutesInMillseconds = 25 * 60 * 1000 + 999;
    var startTime;
    var timerTimeout;

    var updateTime = function () {
        var timeRemaining = twentyFiveMinutesInMillseconds - (new Date().getTime() - startTime);
        if (timeRemaining < 0) {
            displayTime(0);
            $('#sound').get(0).play();   
            return;
        }

        displayTime(timeRemaining);
        timerTimeout = setTimeout(function () { updateTime(); }, 100);
    };

    var displayTime = function (intervalMillseconds) {
        var totalSeconds = Math.floor(intervalMillseconds / 1000);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds - (minutes * 60);
        $('#time_remaining').text(minutes + ":" + ((seconds < 10) ? '0' : '') + seconds);
    };

    return {
        start: function () {
            startTime = new Date().getTime();
            updateTime();
        },

        stop: function () {
            clearTimeout(timerTimeout);
            $('#sound').get(0).pause();
        }
    };
} ();

