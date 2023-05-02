/**
 *  VcController.js v1.0.0
 *  From Rugal Tu
 *  Based on VueModel.js 2.0.0
 * */

class VcController extends CommonFunc {

    constructor() {
        super();

        this.Configs = {};
        this.IsConfigDone = false;
        this.ApiProp = ['Url', 'Type'];
        this.CommandNameProp = ['mode', 'column', 'from', 'to', 'select', 'option', 'display', 'value'];
        this.DefaultVcName = 'Default';
        this.IsUseQueryWhere_VcName = false;

        try {
            this.Model = Model;
        }
        catch {
            this.Model = new VueModel();
        }
    }

    //#region Property
    get Dom() {
        return new DomEditor();
    }
    //#endregion

    //#region With Property

    With_VueModel(SetModel) {
        this.Model = SetModel;
        return this;
    }
    //#endregion

    //#region Add Setting
    AddVc_Config(_Config) {
        let VcName = _Config['VcName'] ?? this.DefaultVcName;
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName], _Config);

        this._ClearConfig();
        return this;
    }

    AddVc_Config_Api(_Api) {
        let VcName = _Config['VcName'] ?? this.DefaultVcName;
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName].Api, _Api);
        this._ClearConfig(VcName);
        return this;
    }

    AddVc_Config_Bind(VcName, _Bind) {
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName].Bind, _Bind);
        this._ClearConfig(VcName);
        return this;
    }
    //#endregion

    //#regin Query Setting
    UseQueryWhere_VcName() {
        this.IsUseQueryWhere_VcName = true;
        return this;
    }
    //#endregion

    //#region Startup
    AsNew() {
        return new VcController();
    }

    Init() {
        if (!this.IsConfigDone) {
            this._SetApi();
            this._SetBind();
            this.IsConfigDone = true;
        }
        return this;
    }

    ApiCall() {
        this.Done();
        this._CallApi();
        return this;
    }
    //#endregion

    //#region Using VueModel2
    _SetApi() {
        this._ForEachKeyValue(this.Configs, (VcName, Config) => {
            this._ForEachKeyValue(Config.Api, (ApiKey, ApiContent) => {
                this._VueModel_AddApi(ApiKey, ApiContent);
            });
        });
        return this;
    }
    _VueModel_AddApi(ApiKey, ApiContent) {
        let Url = ApiContent.Url;
        let MethodType = ApiContent['Type'].toLocaleUpperCase();
        if (MethodType == 'GET')
            this.Model.AddApi_Get(ApiKey, Url);
        else if (MethodType == 'POST')
            this.Model.AddApi_Post(ApiKey, Url);
        else
            throw new Error('error MethodType');
    }

    _SetBind() {
        this._ForEachKeyValue(this.Configs, (VcName, Config) => {
            this._ForEachKeyValue(Config.Bind, (StoreKey, StoreSet) => {
                this._ForEachKeyValue(StoreSet, (ColumnName, ColumnSet) => {
                    let SetArray = ColumnSet;
                    if (!Array.isArray(ColumnSet)) {
                        SetArray = [ColumnSet];
                    }

                    SetArray.forEach(Item => {
                        this._VueModel_AddColumnSet(VcName, StoreKey, Item);
                    });
                })
            });
        });
        return this;
    }
    _VueModel_AddColumnSet(VcName, StoreKey, ColumnSet) {
        let Column = ColumnSet['column'];
        let From = ColumnSet['from'];
        let Mode = ColumnSet['mode'];
        let To = ColumnSet['to'];
        let SetStoreKey = From;
        if (!SetStoreKey.includes(':'))
            SetStoreKey = `${StoreKey}.${From}`;

        let GetDom = this.Dom;
        let GetDoms;
        if (this.IsUseQueryWhere_VcName) {
            let WhereVcName = GetDom._QueryString_Attr('vc-name', VcName);
            let WhereVcCol = GetDom._QueryString_Attr('vc-col', Column)
            GetDoms = GetDom.WithCustom(`${WhereVcName} ${WhereVcCol}`);
        }
        else
            GetDoms = GetDom.WithAttr('vc-col', Column);

        switch (Mode) {
            case 'text':
                this.Model.AddVdom_Text(GetDoms, SetStoreKey);
                break;
            case 'input':
                this.Model.AddVdom_Input(GetDoms, SetStoreKey);
                break;
            case 'select':
                let Option = ColumnSet['option'];
                let Display = ColumnSet['display'];
                let Value = ColumnSet['value'];
                let SelectQuery = Dom._QueryString_Attr('vc-col', Column);
                let OptionQuery = Dom._QueryString_Attr('vc-col', Option);

                this.Model.AddVq_Select({
                    SelectQuery,
                    From,
                    To,
                    OptionQuery,
                    Display,
                    Value,
                })
                break;
            case 'for':
                
                break;
        }
    }

    _CallApi() {
        let AllVcName = Object.keys(this.Configs);
        for (let i = 0; i < AllVcName.length; i++) {
            let VcName = AllVcName[i];
            let GetConfig = this.Configs[VcName];
            if (GetConfig.Api == null)
                return;

            let AllApiKey = Object.keys(GetConfig.Api);
            for (let j = 0; j < AllApiKey.length; j++) {
                let ApiKey = AllApiKey[j];
                let ApiContent = GetConfig.Api[ApiKey];
                this._VueModel_AddApi(ApiKey, ApiContent);
            }
        }
    }
    //#endregion

    //#region Process Function
    _DeepObjectExtend(Target, Source, MaxDepth = 10) {
        if (MaxDepth == 0)
            return {
                ...Target,
                ...Source,
            };

        let AllKeys = Object.keys(Source);
        for (let i = 0; i < AllKeys.length; i++) {
            let Key = AllKeys[i];
            if (!(Key in Target))
                Target[Key] = Source[Key];
            else if (typeof Source[Key] != "object")
                Target[Key] = Source[Key];
            else {
                let NewObject = {
                    ...this._DeepObjectExtend(Target[Key], Source[Key], MaxDepth - 1),
                };
                Target[Key] = NewObject;
            }
        }
        return Target;
    }
    //#endregion

    //#region Config Review

    _Create_Config(VcName) {
        if (this.Configs[VcName] == null)
            this.Configs[VcName] = {
                VcName,
                Api: {},
                Bind: {},
            };
        let GetConfig = this.Configs[VcName];
        if (!('Api' in GetConfig))
            GetConfig['Api'] = {};

        if (!('Bind' in GetConfig))
            GetConfig['Bind'] = {};

        return this;
    }
    _ClearConfig(_VcName = null) {
        let AllVcName = Object.keys(this.Configs);
        if (_VcName != null)
            AllVcName = [_VcName];

        AllVcName.forEach(VcName => {
            let GetConfig = this.Configs[VcName];

            let Api = GetConfig.Api;
            this._ClearConfig_Api(VcName, Api);

            let Bind = GetConfig.Bind;
            this._ClearConfig_Bind(Bind);
        });
        return this;
    }
    _ClearConfig_Api(VcName, Api) {
        this._ForEachKeyValue(Api, (ApiKey, ApiContent) => {
            this._ForEachKeyValue(ApiContent, (ContentKey, Item) => {
                if (this.ApiProp.includes(ContentKey))
                    return;
                delete ApiContent[ContentKey];
                if (ContentKey == 'Bind') {
                    let GetBind = Item;
                    let AddBind = {};
                    if (typeof GetBind != 'object')
                        this._Throw('bind set type error');

                    AddBind[ApiKey] = {
                        ...GetBind
                    };
                    this.AddVc_Config_Bind(VcName, AddBind);
                }
            })
        });
        return Api;
    }
    _ClearConfig_Bind(Bind) {
        this._ForEachKeyValue(Bind, StoreKey => {
            this._CheckConfig_Bind(Bind, StoreKey);
        })
        return Bind;
    }
    _CheckConfig_Bind(Bind, StoreKey) {
        let StoreBind = Bind[StoreKey];
        let ClearCommands = [];
        this._ForEachKeyValue(StoreBind, (OrgLeftCommand, RightCommand) => {
            let LeftCommand = OrgLeftCommand;
            let LeftCommandInfo = this._CheckRequired_LeftCommandInfo(LeftCommand);
            LeftCommand = LeftCommandInfo.ConvertCommand;

            let RightCommandInfos = this._Analyze_CommandInfos_ConvertObject(RightCommand);
            let TotalCommandInfo = this._CheckRequired_RightCommandInfos(LeftCommandInfo, RightCommandInfos, StoreKey);
            ClearCommands.splice(ClearCommands.length, 0, ...TotalCommandInfo);
        });

        Bind[StoreKey] = {};
        StoreBind = Bind[StoreKey];
        for (let i = 0; i < ClearCommands.length; i++) {
            let Command = ClearCommands[i];
            let GetColumn = Command['column'];

            let SetBind = {};
            this.CommandNameProp.forEach(Item => {
                if (Item in Command)
                    SetBind[Item] = Command[Item];
            });
            if (GetColumn in StoreBind == false) {
                StoreBind[GetColumn] = SetBind;
            }
            else {
                if (Array.isArray(StoreBind))
                    StoreBind.push(SetBind);
                else {
                    let OrgBind = StoreBind[GetColumn];
                    StoreBind[GetColumn] = [OrgBind, SetBind];
                }
            }
        }
    }

    _CheckRequired_LeftCommandInfo(LeftCommand) {

        let CommandInfo = this._Analyze_CommandInfo(LeftCommand);
        switch (CommandInfo.CommandName) {
            case 'column':
                break;
            default:
                this._Throw(`error CommandName for LeftCommand of「${CommandInfo.Command}」`)
        }

        return CommandInfo;
    }
    _CheckRequired_RightCommandInfos(LeftCommandInfo, RightCommandInfos, StoreKey) {

        let TotalCommandInfo = [];
        for (let i = 0; i < RightCommandInfos.length; i++) {
            let CommandInfo = RightCommandInfos[i];
            CommandInfo[LeftCommandInfo['CommandName']] = LeftCommandInfo['CommandValue'];
            let InfoResult = this._CheckRequired_CommandInfo(CommandInfo, StoreKey);
            TotalCommandInfo.push(InfoResult);
        }

        return TotalCommandInfo;
    }
    _CheckRequired_CommandInfo(CommandInfo, StoreKey) {

        if (CommandInfo['mode'] == 'select' || CommandInfo['mode'] == 'for') {
            if (CommandInfo['from'] == null) {
                CommandInfo['from'] = StoreKey;
            }
        }

        if (CommandInfo['mode'] == 'select') {
            if (CommandInfo['to'] == null) {
                CommandInfo['to'] = CommandInfo['column']
            }
        }

        if (CommandInfo['from'] == null)
            CommandInfo['from'] = CommandInfo['column'];

        if ('column' in CommandInfo === false)
            this._Throw('「column」command is required, at least one of the param needs to be set')

        if ('mode' in CommandInfo === false)
            CommandInfo['mode'] = 'text';

        this._CheckRequired_Mode(CommandInfo['mode']);

        if ('option' in CommandInfo && CommandInfo['mode'] != 'select')
            throw new Error('if set「option」command,「mode」must be set「select」');

        if ('value' in CommandInfo && 'option' in CommandInfo === false)
            throw new Error('if set「value」command,「option」command is required');

        if ('display' in CommandInfo && 'option' in CommandInfo === false)
            throw new Error('if set「display」command,「option」command is required');

        return CommandInfo;
    }
    _CheckRequired_Mode(Mode) {
        switch (Mode) {
            case 'input':
            case 'text':
            case 'select':
            case 'for':
                break;

            default:
                throw new Error(`the「${Mode}」mode is not allow`);
        }
    }

    _Analyze_CommandInfo(Command) {

        let CheckCommand = Command;
        if (!CheckCommand.includes(':'))
            CheckCommand = `column:${CheckCommand}`;

        let CommandArray = CheckCommand
            .replaceAll(' ', '')
            .split(':');

        if (CommandArray.length > 2)
            this._Throw(`_Analyze_CommandInfo() only can analyze single command of「${Command}」`);

        let CommandName = this._Analyze_CommandName(CommandArray[0]);
        let CommandValue = CommandArray[1];
        let ConvertCommand = `${CommandName}:${CommandValue}`;

        let CommandInfo = {
            Command,
            CommandName,
            CommandValue,
            ConvertCommand
        };
        return CommandInfo;
    }
    _Analyze_CommandName(CommandName) {
        switch (CommandName.toLowerCase()) {
            case 'from':
            case 'f':
                CommandName = 'from';
                break;

            case 'to':
                CommandName = 'to';
                break;

            case 'mode':
            case 'm':
                CommandName = 'mode';
                break;

            case 'column':
            case 'col':
                CommandName = 'column';
                break;

            //#region Select
            case 'select':
            case 'sel':
                CommandName = 'select';
                break;

            case 'option':
            case 'opt':
                CommandName = 'option';
                break;

            case 'value':
            case 'val':
                CommandName = 'value';
                break;

            case 'display':
            case 'dis':
                CommandName = 'display';
                break;
            //#endregion

            default:
                throw new Error(`error CommandName of「${CommandName}」`);
        }
        return CommandName;
    }
    _Analyze_CommandInfos_ConvertObject(RightCommand) {

        let ParamGroups = [];
        if (Array.isArray(RightCommand)) {
            RightCommand.forEach(Item => {
                ParamGroups.push(this._AnalyzeCommandInfos_ConvertString(Item));
            });
        }
        else {
            RightCommand = this._AnalyzeCommandInfos_ConvertString(RightCommand);
            ParamGroups = RightCommand
                .replaceAll(' ', '')
                .split(/[\[\]]/);
        }

        let CommandInfos = [];
        for (let i = 0; i < ParamGroups.length; i++) {
            let Group = ParamGroups[i];

            let CommandArray = Group
                .split(';')
                .filter(Item => !this._IsNullOrEmpty(Item));

            let SetCommandInfo = {};
            for (let j = 0; j < CommandArray.length; j++) {
                let GetCommand = CommandArray[j];
                if (!GetCommand.includes(':'))
                    this._Throw('CommandName is a required parameter in CommandLine mode.');

                let GetInfo = this._Analyze_CommandInfo(GetCommand);
                SetCommandInfo[GetInfo.CommandName] = GetInfo.CommandValue;
            }
            CommandInfos.push(SetCommandInfo);
        }

        return CommandInfos;
    }
    _AnalyzeCommandInfos_ConvertString(RightCommand) {
        if (typeof RightCommand === 'string')
            return RightCommand;

        if (typeof RightCommand === 'object') {
            let CommandArray = [];
            let AllKeys = Object.keys(RightCommand);
            for (let i = 0; i < AllKeys.length; i++) {
                let Key = AllKeys[i];
                let Value = RightCommand[Key];
                CommandArray.push(`${Key}:${Value}`);
            }
            let CommandString = CommandArray.join(';');
            return CommandString;
        }

        throw new Error('error command type');
    }

    //#endregion
}
const Vc = new VcController();