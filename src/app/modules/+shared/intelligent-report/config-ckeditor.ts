export class ConfigCKEditor {

    public static CARGANDO_HTML: string =  `<p style="text-align: center;">&nbsp;</p>
                                            <p style="text-align: center;">
                                            <span style="font-size:22px;">
                                                <span style="color: #228787;text-shadow: 3px 2px 6px rgba(149, 150, 150, 0.77);">
                                                    <strong>Cargando...</strong>
                                                </span>
                                            </span>
                                            </p>`;

    public static CONFIG_PRINT: any = {
        language: 'es',
        uiColor: '#00bcd4',
        title: 'HIS',
        name: 'atributo name',
        height: 600,
        allowedContent: true,
        toolbarGroups: [
            { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
            { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
            { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
            { name: 'forms', groups: [ 'forms' ] },
            { name: 'links', groups: [ 'links' ] },
            '/',
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
            { name: 'insert', groups: [ 'insert' ] },
            '/',
            { name: 'styles', groups: [ 'styles' ] },
            { name: 'colors', groups: [ 'colors' ] },
            { name: 'tools', groups: [ 'tools' ] },
            { name: 'others', groups: [ 'others' ] },
            { name: 'about', groups: [ 'about' ] }
        ],
        removeButtons: 'Save,Source,NewPage,Preview,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Form,HiddenField,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,Bold,Italic,Underline,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,Link,BidiLtr,Language,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,TextColor,About,BGColor,ShowBlocks,Format,Font,FontSize,Maximize,BidiRtl,Unlink'
    };
}