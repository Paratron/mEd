/**
 * modo-markdownrender
 * ===========
 * description
 */
define([], function () {
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

        };

        var that = this;

        var doc;

        this.set = function (value) {
            if (!ready) return this;
            doc = that.el[0].contentDocument;
            doc.open();
            doc.write(marked(value));
            doc.close();
        };
    };

    modo.MarkdownRender.classNames = ['markdownrender'];

    modo.MarkdownRender.prototype = _.clone(modo.Element.prototype);
});