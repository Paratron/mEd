/**
 * settings.js
 * ===========
 * description
 */
define(['modules/gear'], function (gear) {
    var ui = modo.generate([
        {
            type:'PopUp',
            ref:'pop_settings',
            params:{
                className:'pop-modal',
                modal:true
            },
            children:[
                {
                    type:'Label',
                    params:{
                        className:'headline',
                        value:'Settings'
                    }
                },
                {
                    type: 'Label',
                    params: {
                        className: 'smallheadline',
                        value: 'Render Style'
                    }
                },
                {
                    type:'List',
                    ref: 'list',
                    params:{
                        className:'stylepicker',
                        data:gear.get('styles_available'),
                        item_render:function (d, i, k) {
                            var html = '<div' + (gear.get('style') === k ? ' class="active"' : '') + '>';

                            html += '<b>'+ d.title + (gear.get('style') === k ? ' <span>(selected)</span>' : '') + '</b>';
                            if(d.url){
                                html += '<span>by <a target="_blank" href="' + d.url + '">' + d.author + '</a></span>';
                            } else {
                                html += '<span>by ' + d.author + '</span>';
                            }

                            html += '</div>';
                            return html;
                        },
                        item_events: {
                            click: function(e,i,d){
                                gear.set_style(i);
                            },
                            'click a': function(e){
                                e.stopPropagation();
                            }
                        }
                    }
                },

                {
                    type: 'Label',
                    params: {
                        className: 'smallheadline',
                        value: 'Magic Scrolling'
                    }
                },
                {
                    type: 'CheckBox',
                    params: {
                        label: 'Lock scrolling of editor and preview',
                        model: gear,
                        model_key: 'scroll_lock'
                    }
                },
                {
                    type: 'CheckBox',
                    params: {
                        label: 'Scroll preview to editors cursor position',
                        model: gear,
                        model_key: 'follow_cursor'
                    }
                }
            ]
        }
    ]);

    gear.on('change:style', function(){
        ui.list.update();
    });

    return ui;
});