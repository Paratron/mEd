/**
 * modo-markdownrender
 * ===========
 * description
 */
define(['modules/gear'], function (gear) {
    var waiting = [],
            ready = false;

    function requestInstance(callback) {
        if (!ready) {
            waiting.push(callback);
        } else {
            callback();
        }
    }

    (function () {
        var head = document.head || document.getElementsByTagName('head')[0];

        var s = document.createElement('script');
        s.onload = function () {
            ready = true;
            for (var i = 0; i < waiting.length; i++) {
                waiting[i]();
            }
        };
        s.src = 'lib/js/marked.js';

        head.appendChild(s);
    })();

    modo.MarkdownRender = function (params) {
        params || (params = {});

        params.el = $('<iframe></iframe>');

        modo.Element.call(this, params);

        this.addClass(modo.MarkdownRender.classNames[0]);

        var settings = {
            value:'',
            rendered:'',
            scroll_pos:null,
            foreign_scroll:false
        };

        var that = this;

        var $doc;


        function render() {
            var val = '';

            if (!$doc) {
                return;
            }

            var doc = $doc[0],
                    win = $win[0];

            doc.open();

            val = '<html><head><style>' + gear.get('style_css') + '</style></head>';
            val += settings.value;
            val += '</html>';

            settings.rendered = val;

            doc.write();
            doc.write(val);
            doc.close();

            $('a', doc).attr('target', '_blank');

            if (settings.scroll_pos) {
                win.scrollTo(settings.scroll_pos[0], settings.scroll_pos[1]);
            }

            //I don't know WHY, but the window object seems to be re-created on every
            //document creation, so we have to re-attach the listener... :/
            win.onscroll = function (e) {
                if (settings.foreign_scroll) {
                    return;
                }
                var sobj = {
                    top: win.scrollY,
                    clientHeight: that.el.height(),
                    height: $win.height()
                };
                that.trigger('scroll', sobj);
            };
        }

        this.get = function () {
            return settings.rendered;
        };

        /**
         * Will set the content of the preview element to a specific value.
         * @param {String} value
         */
        this.set = function (value) {
            if (!ready) {
                requestInstance(function () {
                    that.set(value);
                });
                return;
            }
            settings.value = marked(value);
            render();
        };

        var $win;
        var ig_timeout;
        this.scrollTo = function (x, y) {
            if (!ready) {
                return;
            }

            if (!$win) {
                return;
            }

            if (typeof y === 'undefined') {
                //Relative scrolling
                var win_height = $win.height();
                var outer_height = that.el.height();

                var sb_height = outer_height / (win_height / 100);
                var msv = (win_height / 100) * (100 - sb_height);

                y = (msv / 100) * x;
                x = 0;
            }

            settings.scroll_pos = [x, y];

            settings.foreign_scroll = true;
            $win[0].scrollTo(x, y);
            //Set this back after the scroll event has been fired.
            clearTimeout(ig_timeout);
            ig_timeout = setTimeout(function () {
                settings.foreign_scroll = false;
            }, 1);
        };

        if (!ready) {
            requestInstance(function () {
                $win = $(that.el[0].contentWindow);
                $doc = $(that.el[0].contentDocument);
                that.trigger('ready');
            });
        }

        gear.on('change:style_css', function () {
            render();
        });
    };

    modo.MarkdownRender.classNames = ['markdownrender'];

    modo.MarkdownRender.prototype = _.clone(modo.Element.prototype);
});