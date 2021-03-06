/*!

Name: Reading Time
Dependencies: jQuery
Author: Michael Lynch
Author URL: http://michaelynch.com
Date Created: August 14, 2013
Date Updated: June 10, 2014
Licensed under the MIT license

*/

;(function($) {

    $.fn.readingTime = function(options) {

        //return if no element was bound
        //so chained events can continue
        if(!this.length) {
            return this;
        }

        //define default parameters
        var defaults = {
            readingTimeTarget: '.eta',
            wordCountTarget: null,
            wordsPerMinute: 600,
            round: true,
            lang: 'cn',
            lessThanAMinuteString: '',
            prependTimeString: '',
            prependWordString: '',
            remotePath: null,
            remoteTarget: null
        }

        //define plugin
        var plugin = this;

        //define element
        var el = $(this);

        //merge defaults and options
        plugin.settings = $.extend({}, defaults, options);

        //define vars
        var readingTimeTarget = plugin.settings.readingTimeTarget;
        var wordCountTarget = plugin.settings.wordCountTarget;
        var wordsPerMinute = plugin.settings.wordsPerMinute;
        var round = plugin.settings.round;
        var lang = plugin.settings.lang;
        var lessThanAMinuteString = plugin.settings.lessThanAMinuteString;
        var prependTimeString = plugin.settings.prependTimeString;
        var prependWordString = plugin.settings.prependWordString;
        var remotePath = plugin.settings.remotePath;
        var remoteTarget = plugin.settings.remoteTarget;


        if(lang == 'cn') {

            var lessThanAMinute = lessThanAMinuteString || "小于1分钟";

            var minShortForm = '分钟';

        //default lang is cn
        } else {

            var lessThanAMinute = lessThanAMinuteString || '小于1分钟';

            var minShortForm = '分钟';

        }

        var setTime = function(text) {

            //通过正则表达式来获得文档的单词，汉字和数字个数
            var totalWords=0;
            var pattern_char = /[a-zA-Z]+/g;
            var pattern_cn = /[\u4e00-\u9fa5]/g;
            var pattern_num = /[0-9]+/g
            var count_char = text.match(pattern_char)?text.match(pattern_char).length:0;
            var count_cn = text.match(pattern_cn)?text.match(pattern_cn).length:0;
            var count_num=text.match(pattern_num)?text.match(pattern_num).length:0;
            totalWords=count_char+count_cn+count_num;

            //define words per second based on words per minute (wordsPerMinute)
            var wordsPerSecond = wordsPerMinute / 60;

            //define total reading time in seconds
            var totalReadingTimeSeconds = totalWords / wordsPerSecond;

            //define reading time in minutes
            //if round is set to true
            if(round === true) {

                var readingTimeMinutes = Math.round(totalReadingTimeSeconds / 60);

            //if round is set to false
            } else {

                var readingTimeMinutes = Math.floor(totalReadingTimeSeconds / 60);

            }

            //define remaining reading time seconds
            var readingTimeSeconds = Math.round(totalReadingTimeSeconds - readingTimeMinutes * 60);

            //if round is set to true
            if(round === true) {

                //if minutes are greater than 0
                if(readingTimeMinutes > 0) {

                    //set reading time by the minute
                    $(readingTimeTarget).text(prependTimeString + readingTimeMinutes + ' ' + minShortForm);

                } else {

                    //set reading time as less than a minute
                    $(readingTimeTarget).text(prependTimeString + lessThanAMinute);

                }

            //if round is set to false
            } else {

                //format reading time
                var readingTime = readingTimeMinutes + ':' + readingTimeSeconds;

                //set reading time in minutes and seconds
                $(readingTimeTarget).text(prependTimeString + readingTime);

            }

            //if word count container isn't blank or undefined
            if(wordCountTarget !== '' && wordCountTarget !== undefined) {

                //set word count
                $(wordCountTarget).text(prependWordString + totalWords);

            }

        };

        //for each element
        el.each(function() {
            //if remotePath and remoteTarget aren't null
            if(remotePath != null && remoteTarget != null) {

                //get contents of remote file
                $.get(remotePath, function(data) {

                    //set time using the remote target found in the remote file
                    setTime($('<div>').html(data).find(remoteTarget).text());

                });

            } else {

                //set time using the targeted element
                setTime(el.text());

            }

        });

    }

})(jQuery);
