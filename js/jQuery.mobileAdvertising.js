/* ========================================================================
 * Mobile advertising: v0.0.4
 *
 * ========================================================================
 * Copyright 2015 Alimov.
 * Licensed under MIT ()
 * ======================================================================== */

if (typeof jQuery == 'undefined') {
    throw new Error('Mobile Advertising\'s JavaScript requires jQuery')
}

+(function($){
    'use strict';

    // Mobile advertising CLASS DEFINITION
    // ====================

    var Mob = function (element, options) {
        this.$element = $(element);
        this.options  = options;

        this.content  = {
            // @TODO XXX Удалить эту порнографию после того как починится возврат с callback
            colorButton: "warning",
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci alias aperiam at consectetur dignissimos distinctio doloremque enim eum eveniet illum itaque laborum nisi obcaecati omnis pariatur possimus quis recusandae reiciendis repellendus repudiandae saepe sed tempore, tenetur veniam, veritatis. Eaque facere, illo numquam odit officiis omnis pariatur porro quidem repudiandae voluptatibus!",
            data: "18.03.2015",
            development: "Разработчик 2",
            imagePath: "",
            title: "Название рекламы 2",
            url: "http://vk.com/dr.alimov"
        };

/*       $.proxy( this.claim(this, function(){
           // @TODO FIXME - починить this должен записываться в Mob -> thi.content
          return this;
       }));
*/

        $.proxy(this.requires(this.options));

        $.proxy(this.show(this));
    };

    Mob.VERSION = '0.0.4';


    Mob.DEFAULTS = {
        debug       : true,
        jsonFolder  : "http://chirurlx.bget.ru/assets/advertising/",
        bsCss       : false,
        bsJs        : false
    };

    Mob.prototype.requires = function (e) {
        if(e.bsCss){
            //@TODO Тут потом надо сделать проверку на доступность опциональной css и в случае успеха загрузить её
        }
        if(e.bsJs){
            //@TODO Тут потом надо сделать проверку на доступность опциональной js и в случае успеха загрузить его
        }
    };

    Mob.prototype.show  = function (e) {

        console.log(e.content);

        var content1 = '<div class="modal-dialog modal-sm">'+
            '<div class="modal-content">'+
            '<div class="modal-header color-white clearfix">'+

            '<div class="col-xs-8 not-padding-w">'+
                //$('<h4/>', {
                //    class: "modal-title color-white",
                //    text: e.content.title
                //});
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
            '<a href="'+ e.content.url +'" class="btn btn-'+e.content.colorButton+' text-uppercase btn-block"><i class="glyphicon glyphicon-download-alt"></i> Установить</a>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'
        e.$element.append(content1).fadeIn('slow');
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

            },
            error: function (data) {

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
            if (typeof option == 'string') data[option]()
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
