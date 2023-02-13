$(document).ready(async () => {

    let ApiGroup = Api.ComponentTest;

    let Url = Api.ExportData.ExportData;

    Api.ComponentTest

    const VcConfig = {
        VcName: 'TestComponent',
        Api: {
            //TestGet: {
            //    Url: ApiGroup.TestGet,
            //    MethodType: 'GET',
            //    Bind: {
            //        'm:text': 'Title,Id',
            //    },
            //},
            TestPost: {
                Url: ApiGroup.TestPost,
                MethodType: 'POST',
                Bind: {
                    ForLabel : 'm:text, c:Item.Title',
                }
            },
            TestSelect: {
                Url: ApiGroup.TestSelect,
                MethodType: 'GET',
                Bind: {
                    TargetSelect: 'c:., m:select, opt:TestOption', // 預設 c:.
                    'm:select': 'TargetSelectA, opt:TestOption, d:Key, v:Value'
                }
            }
        },
    };

    let GetVc = Vc
        .AddVc_Config(VcConfig)
        .Done();

    Model
        //.ApiCall('TestGet')
        //.ApiCall('TestPost', {
        //    Id: '111',
        //    Title: '222'
        //})
        .Init();


});