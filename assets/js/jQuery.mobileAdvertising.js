/* ========================================================================
 * Mobile advertising: v0.1.0
 *
 * ========================================================================
 * Copyright 2015 Alimov.
 * Licensed under MIT (https://github.com/AlimovRoostam/MobileAdvertising.git)
 * ======================================================================== */

if (typeof jQuery == 'undefined') {
    throw new Error('Mobile Advertising\'s JavaScript requires jQuery');
}

+(function($){
    'use strict';

    // Mobile advertising CLASS DEFINITION
    // ====================

    var Mob = function (element, options) {

        this.$element = $(element);
        this.options  = options;
        this.suffix   = isMobile()[0].toLowerCase();
        typeof ymaps == 'undefined' || (this.geoLocation = ymaps.geolocation);

        $.proxy(this.claim(this, function(){
            $.proxy(this.show(this));
        }));
    };

    Mob.VERSION = '0.1.0';

    Mob.DEFAULTS = {
        'json_folder'   : "/assets/advertising/"
    };

    // Mobile show modal
    // =====================

    Mob.prototype.show  = function (e) {

        var content1 = '<div class="modal-dialog modal-sm">'+
            '<div class="modal-content">'+
            '<div class="modal-header color-white clearfix">'+

            '<div class="col-xs-8 not-padding-w">'+
            '<h4 class="modal-title color-white">'+ e.content.title +'</h4>'+
            '</div>'+

            '<div class="col-xs-4 not-padding-w">'+
            '<div class="clearfix mb5px">'+
            '<button type="button" class="close color-white" data-dismiss="modal" aria-label="Close"><span class="color-white" aria-hidden="true">&times;</span></button>'+
            '</div>'+
            '<a href="' + e.content.url + '" class="btn text-uppercase btn-success btn-xs notbdrs pull-right">Бесплатно</a>'+
            '</div>'+

            '</div>'+

            '<div class="modal-body">'+
            e.content.content +
            '</div>'+

            '<div class="modal-footer text-center">'+
            '<div class="clearfix mb5px">'+
            '<a href="'+ e.content.url +'" class="btn btn-'+e.content.colorButton+' text-uppercase btn-block"><i class="glyphicon glyphicon-download-alt"></i> '+ e.content.textButton +'</a>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';

        e.$element.append(content1).fadeIn('slow');

    };

    // Mobile advertising claim ajax to json
    // =====================

    Mob.prototype.claim = function (e, callback) {
        var keyAdvertising  = ("suffix" in e) ? e.options[e.suffix] : false;

        $.ajax({ //@TODO ПОДУМАТЬ как упростить и избавиться от 2 циклов
            url: e.options.json_folder + e.suffix + '.json',
            dataType: 'json',
            scriptCharset: 'utf-8',
            timeout: 10000,
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
    // =====================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('mob.advertising'),
                options = $.extend({}, Mob.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('mob.advertising', (data = new Mob(this, options)));
            if (typeof option == 'string') data[option](); //@TODO XXX
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
            Plugin.call($('<div/>',{'data-ride': 'mobile-advertising'}).appendTo('body'))
        }
    });

})(jQuery);