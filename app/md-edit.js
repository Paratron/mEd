/**
 * md-edit
 * =======
 * description
 */

require.config({
    //urlArgs:"bust=" + (new Date()).getTime() //Remove after development
});

define(['ui/base'], function (ui) {

    var cm,
            actions;

    /**
     * This actions can bei either invoked by the toolbar, or by a hotkey.
     * @type {Object}
     */
    actions = {
        newdoc: function(){
            cm.setValue('');
        },
        bold:function () {
            var selection = cm.getSelection(),
                    cursor = cm.getCursor();
            cm.replaceSelection('**' + selection + '**');
            if (!selection) {
                cursor.ch += 2;
                cm.setCursor(cursor);
            }
            cm.focus();
        },
        italic:function () {
            var selection = cm.getSelection(),
                    cursor = cm.getCursor();
            cm.replaceSelection('*' + selection + '*');
            if (!selection) {
                cursor.ch += 1;
                cm.setCursor(cursor);
            }
            cm.focus();
        },
        quote: function(){
            var cursor = cm.getCursor(),
                line = cm.getLine(cursor.line);

            cm.setLine(cursor.line, '> ' + line);
            cursor.ch += 2;
            cm.setCursor(cursor);
        }
    };

    /**
     * When the codemirror is ready with its creation process, get a reference
     * of the cm object for usage in the action functions.
     * Also, the codemirror element is being focused.
     */
    ui.codemirror.once('ready', function () {
        cm = ui.codemirror.cm;
        ui.codemirror.focus();
    });

    /**
     * Whenever a change is made to the codemirror element, forward the content
     * to the preview element.
     */
    ui.codemirror.on('change', function (content) {
        ui.preview.set(content);
    });

    /**
     * Whenever a button on the toolbar is clicked, invoke the according action,
     * if available.
     */
    ui.toolbar.on('click', function(e, key){
        if(typeof actions[key] === 'function'){
            actions[key]();
        }
    });

    /**
     * Listen to a couple of hotkeys and invoke the according action.
     */
    modo.key_listener.enable();
    var strokes = {
        'ctrl+b': 'bold',
        'ctrl+i': 'italic',
        'ctrl+q': 'quote',
        'alt+n': 'newdoc'
    };
    modo.key_listener.on('stroke', function(e, stroke){
        if(typeof strokes[stroke] === 'undefined') return;
        actions[strokes[stroke]]();
        e.preventDefault();
        e.stopPropagation();
    });


    /**
     * Throw the whole UI construct at the DOM.
     */
    modo.init(ui.root);
});