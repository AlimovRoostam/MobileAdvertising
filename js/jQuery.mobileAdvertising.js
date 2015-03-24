/* ========================================================================
 * Mobile advertising: v0.0.1
 *
 * ========================================================================
 * Copyright 2015 Alimov.
 * Licensed under MIT ()
 * ======================================================================== */

if (typeof jQuery == 'undefined') {
    throw new Error('Mobile Advertising\'s JavaScript requires jQuery')
}

//    if(isMobile() || Mob.DEFAULTS.debug){ //Тут должно быть условие на версию development

+(function($){
    'use strict';

    // Mobile advertising CLASS DEFINITION
    // ====================

    var Mob = function (element, options) {
        this.$element = $(element);
        this.options  = options;

        var constent;

       $.proxy( this.claim(this, function(constent){}));
        console.log(constent)
    };

    Mob.VERSION = '0.0.1';
    Mob.DEFAULTS = {
        "debug" : true,
        "jsonFolder"  : "http://chirurlx.bget.ru/assets/advertising/"
    };
    Mob.prototype.show  = function  (e){

    };
    Mob.prototype.claim = function (e, callback) {
        var suffix = isMobile()[0].toLowerCase();
        $.ajax({
            url: e.options.jsonFolder + suffix + '.json',
            dataType: "json",
            success: function (data) {
                var keyAdvertising  = (suffix in e.options) ? e.options[suffix] : Math.round(0.5 + Math.random() * (Object.keys(data).length)),
                    counter         = 1;

                $.each(data, function (i, val) {
                    if (keyAdvertising == i || keyAdvertising == counter) {
                        callback.call(val[0]);
                        return false;
                    }
                    counter++;
                });

                //if(e.options.debug){
                //    var debug = {
                //        'Запрос ajax' : e.options.jsonFolder,
                //        'Функция обработчик': 'Mob.prototype.claim',
                //        'Входные параметры': e,
                //        'Успех по запросу': data,
                //        'Ключ поиска': keyAdvertising,
                //        'Тип поиска по ключу': (typeof keyAdvertising == 'string') ? 'строка' : 'Случайно'
                //
                //    };
                //    console.log(debug);
                //}
            },
            error: function (data) {

            }
        });
    };
    // Mobile advertising PLUGIN DEFINITION
    // =====================
    function Plugin(option) {
        console.log(option);

        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('mob.advertising'),
                options = $.extend({}, Mob.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('mob.advertising', (data = new Mob(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.mobileAdvertising;

    $.fn.mobileAdvertising             = Plugin;
    $.fn.mobileAdvertising.Constructor = Mob;

    // Mobile advertising NO CONFLICT
    // ===============
    $.fn.mobileAdvertising = function () {
        $.fn.mobileAdvertising = old;
        return this
    };

    // Mobile advertising check devise
    // ===============
    function isMobile(){ // Проверка браузера мобилки (есть возможность дописать больше или разграничить технику apple)
        var Device = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            Chrome: function() {
                return navigator.userAgent.match(/Mozilla/i)
            }
        };
        return (Device.Android() || Device.BlackBerry() || Device.iOS() || Device.Opera() || Device.Windows() || Device.Chrome());
    }

    //Mobile advertising DATA-API
    //=================
    $(window).on('load',function(){
        var counter = 0;
        $('[data-ride="mobile-advertising"]').each(function(){
            var $advertising = $(this);
            Plugin.call($advertising, $advertising.data());
            counter++;
        });

        if(!counter){
            Plugin.call($('<div/>',{
                            'data-ride': 'mobile-advertising'
                        }).appendTo('body'))
        }
    });
})(jQuery);

$(function(){
    $('#qq').mobileAdvertising({
        'debug': false,
        'jsonFolder': '111'
    });

});
