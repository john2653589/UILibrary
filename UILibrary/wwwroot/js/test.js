$(document).ready(async () => {

    let ApiGroup = Api.ComponentTest;

    let Url = Api.ExportData.ExportData;

    const VcConfig = {
        VcName: 'TestComponent',
        Api: {
            //ApiKey = StorageKey
            TestPost: { //Url、Type、Bind
                Url: ApiGroup.TestPost,
                Type: 'POST',
                Bind: {
                    //vc-col
                    Lbl: {
                        Mode: 'text',
                        //From Source
                        From: 'Title', //Default From = TestPost.Title
                    },
                    Lbl4: {
                        Mode: 'text',
                        From: 'TestGet.Title',
                    },
                    Lbl2: {
                        Mode: 'input',
                        //Default From = vc-col
                        //From : TestPost.Lbl2
                    },
                    Lbl3: 'm:input; f:Title',
                    Sel4: {
                        Mode: 'select',
                        Opt: 'Opt5',
                        Display: 'CountyName', // Item.CountyName
                        Value: 'CountyId', // Item.CountyId
                        To: 'Result',
                        //From: 'TestPost' ; Not TestPost.Sel4
                    },
                    Sel42: 'm:select; opt:opt5; d:CountyName; v:CountyId; to:Result',
                    Sel5: {
                        Mode: 'select',
                        Opt: 'Opt6',
                        Value: 'CountyId',
                        From: '-html',
                    },
                    Sel6: 'm:select; opt:Opt6; v:CountyId; f:-html',
                    Array7: {
                        Mode: 'for',
                        //From: 'TestPost' ; Not TestPost.Array7
                    },
                    ForText: { //Label
                        Mode: 'text',
                        From: 'Item.ForText',
                    },
                    ForInput: { //Input
                        Mode: 'input',
                        From: 'Item.ForInput',
                    },
                },
                AutoBind: { // vc-auto="input"; vc-auto="text"
                    //From: 'TestPost',
                    //To: 'TestPost',
                },
            },
        },
        Bind: {
            StorageKey: {
                AutoBind: {
                    To: 'Create',
                }
            }
        },
    };

    let GetVc = Vc
        .AddVc_Config(VcConfig)
        .Done();

    Model
        //.ApiCall('TestGet')e4
        //.ApiCall('TestPost', {
        //    Id: '111',
        //    Title: '222'
        //})
        .Init();
});