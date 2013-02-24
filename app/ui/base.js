/**
 * base.js
 * ===========
 * Generates the UI base.
 */
define(['modo/modo-codemirror', 'modo/modo-markdownrender'], function () {
    return modo.generate([
        {
            type:'FlexContainer',
            ref:'root',
            params:{
                direction:modo.FlexContainer.VERTICAL
            },
            children:[
                {
                    type:'Toolbar',
                    ref:'toolbar',
                    params:{
                        className:'toolbar',
                        elements:[
                            [
                                {
                                    key:'newdoc',
                                    tooltip:'New Document (ALT+N)',
                                    className:'icon-file'
                                },
                                {
                                    key:'open',
                                    tooltip:'Open Document (ALT+O)',
                                    className:'icon-upload'
                                },
                                {
                                    key:'save',
                                    tooltip:'Save Document (ALT+S)',
                                    className:'icon-download'
                                }
                            ],
                            [
                                {
                                    key:'bold',
                                    tooltip:'Bold Format (CTRL+B)',
                                    className:'icon-bold'
                                },
                                {
                                    key:'italic',
                                    tooltip:'Italic Format (CTRL+I)',
                                    className:'icon-italic'
                                },
                                {
                                    key:'quote',
                                    tooltip:'Quote (CTRL+Q)',
                                    className:'icon-quotes-left'
                                }
                            ],
                            [
                                {
                                    key:'link',
                                    tooltip:'Link',
                                    className:'icon-link'
                                },
                                {
                                    key:'image',
                                    tooltip:'Image',
                                    className:'icon-image'
                                },
                                {
                                    key:'code',
                                    tooltip:'Code',
                                    className:'icon-code'
                                },
                                {
                                    key:'list',
                                    tooltip:'Insert List',
                                    className:'icon-list'
                                },
                                {
                                    key:'line',
                                    tooltip:'Horizontal Ruler',
                                    className:'icon-minus'
                                },
                                {
                                    key:'table',
                                    tooltip:'Insert Table',
                                    className:'icon-table'
                                }
                            ],
                            [
                                {
                                    key:'settings',
                                    tooltip:'Settings',
                                    className:'icon-cog'
                                }
                            ]
                        ]
                    }
                },
                {
                    type:'FlexContainer',
                    flexible:true,
                    params:{
                        className:'workspace',
                        direction:modo.FlexContainer.HORIZONTAL
                    },
                    children:[
                        {
                            type:'CodeMirror',
                            ref:'codemirror',
                            params:{
                                className:'markdown-editor',
                                mode:'markdown',
                                lineNumbers:true
                            }
                        },
                        {
                            type:'MarkdownRender',
                            flexible:true,
                            ref:'preview',
                            params:{
                                className:'html-preview'
                            }
                        }
                    ]
                }
            ]
        }
    ]);
});