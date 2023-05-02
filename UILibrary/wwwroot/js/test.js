
$(document).ready(async () => {

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
                Bind: {
                    GetSelect: 'm:select; opt:GetOption; dis:Dis; val:Val; to:AAA',
                    ForCol: ['m:text; f:Dis;', 'm:for;'],
                },
            },
        },
        Bind: {
            //StoreKey
            Default: {
                //vc-col="Title"
                Title: 'f:Title',
                Content: 'f:Content',
                UserInput: 'm:input',
                GetDateTime: 'm:input',
            }
        },
    };

    Vc
        //.UseQueryWhere_VcName()
        .AddVc_Config(VcConfig)
        .Init();

    //.AddVq_AutoBind_Text('[vc-col]', 'vc-col', 'Default')
    //.AddVq_AutoBind_Input('[vc-col]', 'vc-col', 'Default')
    Model
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
        })
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