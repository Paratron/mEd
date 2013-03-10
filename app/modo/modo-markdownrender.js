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
            rendered: ''
        };

        var that = this;

        var doc;

        function render() {
            var val = '';

            doc = that.el[0].contentDocument;
            doc.open();

            val = '<html><head><style>' + gear.get('style_css') + '</style></head>';
            val += settings.value;
            val += '</html>';

            settings.rendered = val;

            doc.write();
            doc.write(val);
            doc.close();
        }

        this.get = function(){
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

        gear.on('change:style_css', function(){
            render();
        });
    };

    modo.MarkdownRender.classNames = ['markdownrender'];

    modo.MarkdownRender.prototype = _.clone(modo.Element.prototype);
});