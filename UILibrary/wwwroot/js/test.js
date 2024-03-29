﻿const s = 1;
Loaded(() => {
    let ApiGroup = Api.ComponentTest;
    let Url = Api.ExportData.ExportData;

    const VcConfig = {
        VcName: 'TestComponent',
        Api: {
            //ApiKey
            SelArray: {
                //Url
                Url: ApiGroup.TestPost,
                //Method Type
                Type: 'POST',
                //Bind: {
                //    GetSelect: 'm:select; opt:GetOption; dis:Dis; val:Val; to:AAA',
                //    ForCol: ['m:text; f:Item.Dis;', 'm:for;'],
                //},
            },
            Default: {
                Url: ApiGroup.TestPost,
                Type: 'POST',
                AutoBind: ['m:text', 'm:select'],
            },
            TestUpload: {
                Url: 'vosocc/api/InsaragGuide/TestUpload',
                Type: 'POST',
            }
        },
        Bind: {
            //FileDefault: {
            //    AAA: 'm:file'
            //}
            //Default: {
            //Title: 'm:text;',
            //Content: 'f:Content',
            //UserInput: 'm:input',
            //GetDateTime: 'm:input',
            //}
        },
    };

    Vc
        //.UseQueryWhere_VcName()
        .AddVc_Config(VcConfig)
        .AddVc_Config({
            VcName: 'TestComponent2',
            AutoBind: {
                Default: [
                    'm:text',
                    'm:input',
                ],
                //File: 'm:file',
            },
            Bind: {
                File: {
                    //AAA: 'm:file; to:ABCS',
                },
            }
        })
        .Init();

    Model
        .AddVcol_File('AAA', 'ASD', {
            IsAddMode: true,
            ConverFileFunc: (File, Store) => {
                var reader = new FileReader();
                reader.readAsDataURL(File);
                reader.onload = () => {
                    Store['Bsae64'] = reader.result;
                };
            },
        })
        .AddVcol_Click('BtnTest', (Idx) => {
            Model.ApiCall_Form('TestUpload', {
                Form: {
                    Id: 1,
                    Content: '123ASD',
                },
                File: {
                    File: Model.FileStore['AAA'],
                    File2: Model.FileStore['BBB'],
                },
            })
        })
        .UpdateStore(
            [{
                Dis: '測試1',
                Val: 1
            },
            {
                Dis: '測試2',
                Val: 2
            }, {
                Dis: '測試3',
                Val: 3
            }], 'SelArray')
        .UpdateStore({
            Title: '123123',
            Content: 'ABC',
            UserInput: '123',
            GetDateTime: '2023/04/29 23:59',
            GetSelect: 3,
            SelStatic: 4,
        })
        .UpdateStore({
            TestBind: '1',
            TestBind2: '2',
            Test: '3',
            Bind3: '4',
            BindInput: 5,
        }, 'Default2')
        .Init();

    //#region sample
    //Bind: {
    //    //vc-col
    //    Lbl: {
    //        Mode: 'text',
    //            //From Source
    //            From: 'Title', //Default From = TestPost.Title
    //                },
    //    Lbl4: {
    //        Mode: 'text',
    //            From: 'TestGet.Title',
    //                },
    //    Lbl2: {
    //        Mode: 'input',
    //                    //Default From = vc-col
    //                    //From : TestPost.Lbl2
    //                },
    //    Lbl3: 'm:input; f:Title',
    //        Sel4: {
    //        Mode: 'select',
    //            Opt: 'Opt5',
    //                Display: 'CountyName', // Item.CountyName
    //                    Value: 'CountyId', // Item.CountyId
    //                        To: 'Result',
    //                    //From: 'TestPost' ; Not TestPost.Sel4
    //                },
    //    Sel42: 'm:select; opt:opt5; d:CountyName; v:CountyId; to:Result',
    //        Sel5: {
    //        Mode: 'select',
    //            Opt: 'Opt6',
    //                Value: 'CountyId',
    //                    From: '-html',
    //                },
    //    Sel6: 'm:select; opt:Opt6; v:CountyId; f:-html',
    //        Array7: {
    //        Mode: 'for',
    //                    //From: 'TestPost' ; Not TestPost.Array7
    //                },
    //    ForText: { //Label
    //        Mode: 'text',
    //            From: 'Item.ForText',
    //                },
    //    ForInput: { //Input
    //        Mode: 'input',
    //            From: 'Item.ForInput',
    //                },
    //},
    //#endregion

});
