'use strict';

var jcw = (function ($) {
    //定义一个冒泡事件，用来实现点击菜单栏以外的区域关闭菜单栏
    function stopFunc(e){   
        e.stopPropagation?e.stopPropagation():e.cancelBubble = true;       
    }
    var
    mainMenu = function () {
        //实现点击其他按钮，菜单栏关闭，方法挪到后面
        //document.onclick = function(e){
        //    menuOvrl.removeClass('open');
        //}
        var menuOvrl = $('.js-main-menu-ovrl');
        $('.js-main-menu-open').on('click', function (e) {
            e.preventDefault();
            menuOvrl.addClass('open');
            e = e||event; stopFunc(e);
        });
        $('.js-main-menu-close').on('click', function (e) {
            e.preventDefault();
            menuOvrl.removeClass('open');
        });
        menuOvrl.on('click',function(e){
            e = e||event; stopFunc(e);
        });
    },

    // change color according to the background
    headerTitles = function () {
        if ($('.js-bg-check').length && $('.js-blog-bg-image').length) {
            var imgPath = $('.js-blog-bg-image').css('background-image');
            imgPath = imgPath && imgPath.match(/url\((['"])?(.*?)\1\)/);
            imgPath = imgPath && imgPath[2];
            if (imgPath) {
                $('<img>').attr('src', imgPath).load(function() {
                   $(this).remove();
                   BackgroundCheck.init({
                        targets: '.js-bg-check',
                        images: '.js-blog-bg-image',
                        threshold: 70,
                        classes: {
                            light: 'element-dark', // when background is light
                            dark: 'element-light', // when background is dark
                            complex: 'element-complex'
                        }
                    });
                });
            }
        }
    },

    // https://highlightjs.org/
    syntaxHighlighter = function () {
        hljs.initHighlightingOnLoad();
    },

    searchModule = function () {
        var $openSearchBtn = $('.js-open-search');
        var $closeSearchBtn = $('.js-close-search');
        var $bigSearchContainer = $('.big-search');
        // ghost hunter init
        var ghostHunter = $('.js-search-input').ghostHunter({
            results: '.js-search-results',
            info_template:"<p>搜索结果 : {{amount}}</p>",
            result_template: '<a href="{{link}}"><h2><i class="fa fa-fw fa-dot-circle-o"></i> {{title}}</h2></a>',
            onKeyUp: true
        });
        //实现点击空白处关闭搜索框
        document.onclick = function(e){
            $('.js-main-menu-ovrl').removeClass('open');
            ghostHunter.clear();
            $bigSearchContainer.removeClass('open');
        }
        $openSearchBtn.on('click', function (e) {
            e.preventDefault();
            $bigSearchContainer.addClass('open');
            e = e||event; stopFunc(e);
            $(window).scrollTop(0);
            $bigSearchContainer.find('input[type=text]').focus();
        });
        $closeSearchBtn.on('click', function (e) {
            e.preventDefault();
            ghostHunter.clear();
            $bigSearchContainer.removeClass('open');
        });
        $('.big-search-container').on('click',function(e){
            e = e||event; stopFunc(e);
        });
    },

    goToTop = function() {
        var backToTopButton = $('.js-back-to-top-btn');
        if($(backToTopButton).length) {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 300) {
                    $(backToTopButton).removeClass('hidden');
                } else {
                    $(backToTopButton).addClass('hidden');
                }
            });
            $(backToTopButton).on('click', function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 800);
            });
        }
    },

    // based on : 'Reading Position Indicator' article
    // http://css-tricks.com/reading-position-indicator/
    positionIndicator = function () {
        if ($('.js-post-reading-time').is(':visible')) {
            imagesLoaded('.post-content', function () {
                var getHeader = function() {
                    return $('header').height()+240
                }
                var getMax = function() {
                    return $('.post-content').height();
                };
                var getValue = function() {
                    return $(window).scrollTop()-getHeader();
                };
                var progressBar, max, value, width, percent;
                if('max' in document.createElement('progress')){
                    // Browser supports progress element
                    progressBar = $('progress');
                    // Set the Max attr for the first time
                    progressBar.attr({ max: getMax() });
                    $(document).on('scroll', function(){
                        // On scroll only Value attr needs to be calculated
                        progressBar.attr({ value: getValue() });
                        percent = Math.floor((getValue() / getMax()) * 100) ;
                        if (percent < 0) {
                            percent = 0;
                            $('.js-post-sticky-header').removeClass('visible');
                        } else if (percent > 100) {
                            percent = 100;
                            $('.js-post-sticky-header').removeClass('visible');
                        } else {
                            $('.js-post-sticky-header').addClass('visible');
                        }
                        $('.js-percent-count').text(percent + '%');
                    });
                    $(window).resize(function(){
                        // On resize, both Max/Value attr needs to be calculated
                        progressBar.attr({ max: getMax(), value: getValue() });
                    });
                }
                else {
                    progressBar = $('.progress-bar'),
                        max = getMax(),
                        value, width;
                    var getWidth = function(){
                        // Calculate width in percentage
                        value = getValue();
                        width = (value/max) * 100;
                        width = width + '%';
                        return width;
                    };
                    var setWidth = function(){
                        progressBar.css({ width: getWidth() });
                        $('.js-percent-count').text(getWidth());
                    };
                    $(document).on('scroll', setWidth);
                    $(window).on('resize', function(){
                        // Need to reset the Max attr
                        max = getMax();
                        setWidth();
                    });
                }
            });
        }
    },

    readingTime = function () {
        var $postArticleContent = $('.post-content');
        if ($postArticleContent.length) {
            $postArticleContent.readingTime({
                wordCountTarget: $('.js-post-reading-time').find('.js-word-count')
            });
        }
    },

    // jcw javascripts initialization
    init = function () {
        mainMenu();
        $(document).foundation();
        headerTitles();
        syntaxHighlighter();
        searchModule();
        goToTop();
        positionIndicator();
        readingTime();
    };

    return {
        init: init
    };

})(jQuery);

(function () {
    jcw.init();
})();
