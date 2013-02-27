/**
 * settings.js
 * ===========
 * description
 */
define(['text!default_styles.json'], function (css_styles) {
    css_styles = JSON.parse(css_styles);

    return modo.generate([
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
                        value: ''
                    }
                },
                {
                    type:'List',
                    params:{
                        className:'stylepicker',
                        data:css_styles,
                        item_render:function (d) {
                            var html = '<div>';

                            html += '<b>'+ d.title +'</b>';
                            html += '<span>by <a href="' + d.url + '">' + d.author + '</a></span>';

                            html += '</div>';
                            return html;
                        }
                    }
                }
            ]
        }
    ]);
});