/* ========================================================================
 * Mobile advertising: v0.1.3
 *
 * ========================================================================
 * Copyright 2015 Alimov.
 * Licensed under MIT (https://github.com/AlimovRoostam/MobileAdvertising.git)
 * ======================================================================== */

if (typeof jQuery == 'undefined') {
    throw new Error('Mobile Advertising\'s JavaScript requires jQuery');
}

+(function($){
    // Mobile advertising CLASS DEFINITION
    // ===================================

    var Mob = function (element, options) {

        this.$element = $(element);
        this.options  = options;
        this.suffix   = isMobile()[0].toLowerCase();
        typeof ymaps == 'undefined' || (this.geoLocation = ymaps.geolocation);

        $.proxy(this.claim(this, function(){
            $.proxy(this.show(this));
        }));
    };

    Mob.VERSION = '0.1.3';

    Mob.DEFAULTS = {
        'json_folder'   : "/assets/advertising/",
        'tpl_folder'    : "/assets/templates/default/"
    };

    // Mobile show modal
    // =================

    Mob.prototype.show  = function (e) {

        $.ajax({
            url: e.options["tpl_folder"] + e.suffix +'.tpl',
            dataFilter: function(str){ //http://javascript.ru/unsorted/templating
                function Tpl (str, data){
                    var fn = !/\W/.test(str) ? cache[str] = cache[str] :
                        new Function("obj",
                            "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" +
                            str
                                .replace(/[\r\t\n]/g, " ")
                                .split("{{").join("\t")
                                .replace(/((^|}})[^\t]*)'/g, "$1\r")
                                .replace(/\t=(.*?)}}/g, "',$1,'")
                                .split("\t").join("');")
                                .split("}}").join("p.push('")
                                .split("\r").join("\\'")
                            + "');}return p.join('');");
                    return data ? fn(data) : fn;
                }
                return e.$element.innerHTML = Tpl(str, e.content);
            },
            success: function (data) {
               $(data).appendTo(e.$element).fadeIn();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            }
        });

    };

    // Mobile advertising claim ajax to json
    // =====================================

    Mob.prototype.claim = function (e, callback) {
        var keyAdvertising  = ("suffix" in e) ? e.options[e.suffix] : false;

        $.ajax({
            url: e.options.json_folder + e.suffix + '.json',
            dataType: 'json',
            scriptCharset: 'utf-8',
            timeout: 10000,
            contentType: 'application/json',
            dataFilter: function(data, type){
                if ((type == "json") && ("geoLocation" in e)) {
                    var parsed_data = JSON.parse(data);

                    $.each(parsed_data, function (i, val) {
                        if (!val[0]["country"]) return;
                        if (val[0]["country"] !== e.geoLocation["country"]){
                            if(keyAdvertising == i) keyAdvertising = false;
                            delete parsed_data[i];
                        }
                    });
                    return JSON.stringify(parsed_data)
                }
                else return data;
            },
            success: function (data) {
                var randomKey = Math.round(0.5 + Math.random() * (Object.keys(data).length)),
                    counter   = 1;

                $.each(data, function (i, val) {
                    if ((keyAdvertising == i) || (randomKey == counter)) {
                        e.content = val[0];
                        callback.call(e);
                        return false;
                    }
                    counter++;
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            }
        });
    };

    // Mobile advertising PLUGIN DEFINITION
    // ====================================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('mob.advertising'),
                options = $.extend({}, Mob.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('mob.advertising', (data = new Mob(this, options)));
            if (typeof option == 'string') data[option]();
        })
    }

    var old = $.fn.mobileAdvertising;

    $.fn.mobileAdvertising              = Plugin;
    $.fn.mobileAdvertising.Constructor  = Mob;

    // Mobile advertising NO CONFLICT
    // ===============

    $.fn.mobileAdvertising.noConflict = function () {
        $.fn.mobileAdvertising = old;
        return this
    };

    // Mobile advertising check devise
    // ===============================

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

    // Mobile advertising DATA-API
    // ===========================

    $(window).on('load',function(){
        var counter = 0;
        $('[data-ride="mobile-advertising"]').each(function(){
            var $advertising = $(this);
            Plugin.call($advertising, $advertising.data());
            counter++;
        });
        if(!counter){
            Plugin.call($('<div/>',{'data-ride': 'mobile-advertising'}).appendTo('body'))
        }
    });

})(jQuery);