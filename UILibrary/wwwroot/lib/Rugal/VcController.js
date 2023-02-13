/**
 *  VueModel.js v2.0.0
 *  From Rugal Tu
 *  Based on Vue3
 * */
class VcController {

    constructor() {
        this.Configs = {};
        this.IsConfigDone = false;
    }

    //#region Add Setting
    AddVc_Config(_Config) {
        let VcName = _Config['VcName'];
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName], _Config);

        this._ClearConfig();
        return this;
    }

    AddVc_Config_Api(VcName, _Api) {
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

    //#region Startup
    Done() {
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
        this._BaseForEach_Api(Api => {
            let AllApiKey = Object.keys(Api);
            for (let j = 0; j < AllApiKey.length; j++) {
                let ApiKey = AllApiKey[j];
                let ApiContent = Api[ApiKey];
                this._VueModel_AddApi(ApiKey, ApiContent);
            }
        });
        return this;
    }
    _VueModel_AddApi(ApiKey, ApiContent) {
        let Url = ApiContent.Url;
        let MethodType = ApiContent.MethodType.toLocaleUpperCase();
        if (MethodType == 'GET')
            Model.AddApi_Get(ApiKey, Url);
        else if (MethodType == 'POST')
            Model.AddApi_Post(ApiKey, Url);
        else
            throw new Error('error MethodType');
    }

    _SetBind() {
        this._BaseForEach_Bind(Bind => {
            let AllStoreKeys = Object.keys(Bind);
            for (let j = 0; j < AllStoreKeys.length; j++) {
                let StoreKey = AllStoreKeys[j];
                let StoreSet = Bind[StoreKey];
                let AllColumnSet = Object.keys(StoreSet);
                for (let k = 0; k < AllColumnSet.length; k++) {
                    let ColumnName = AllColumnSet[k];
                    let ColumnSet = StoreSet[ColumnName];
                    this._VueModel_AddColumnSet(StoreKey, ColumnName, ColumnSet);
                }
            }
        });
        return this;
    }
    _VueModel_AddColumnSet(StoreKey, ColumnName, ColumnSet) {
        let { Col, Mode } = ColumnSet;

        let GetDoms = Dom.WithAttr('vc-col', ColumnName);
        let SetStoreKey = `${StoreKey}.${Col}`;
        switch (Mode) {
            case 'text':
                Model.AddVdom_Text(GetDoms, SetStoreKey);
                break;
            case 'input':
                Model.AddVdom_Input(GetDoms, SetStoreKey);
                break;
            case 'select':
                let ss = 1;
                ss = 2;
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

    _BaseForEach_Api(EachFunc, VcName = null) {
        this._BaseForEach_Config((GetConfig, GetVcName) => {
            if (GetConfig.Api == null)
                return;

            EachFunc(GetConfig.Api, GetVcName);
        }, VcName);
    }
    _BaseForEach_Bind(EachFunc, VcName = null) {
        this._BaseForEach_Config((GetConfig, GetVcName) => {
            if (GetConfig.Bind == null)
                return;

            EachFunc(GetConfig.Bind, GetVcName);
        }, VcName);
    }
    _BaseForEach_Config(EachFunc, VcName = null) {
        let AllVcName = VcName == null ? Object.keys(this.Configs) : [VcName];
        for (let i = 0; i < AllVcName.length; i++) {
            let GetVcName = AllVcName[i];
            let GetConfig = this.Configs[GetVcName];
            EachFunc(GetConfig, GetVcName);
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

        for (let i = 0; i < AllVcName.length; i++) {
            let VcName = AllVcName[i];
            let GetConfig = this.Configs[VcName];

            let Api = GetConfig.Api;
            this._ClearConfig_Api(VcName, Api);

            let Bind = GetConfig.Bind;
            this._ClearConfig_Bind(Bind);
        }
        return this;
    }
    _ClearConfig_Api(VcName, Api) {
        let AllApiKey = Object.keys(Api);
        let ApiProp = ['Url', 'MethodType'];
        for (let i = 0; i < AllApiKey.length; i++) {
            let ApiKey = AllApiKey[i];
            let ApiContent = Api[ApiKey];

            let ContentKeys = Object.keys(ApiContent);
            for (let j = 0; j < ContentKeys.length; j++) {
                let ContentKey = ContentKeys[j];
                if (ApiProp.includes(ContentKey))
                    continue;

                if (ContentKey == 'Bind') {
                    let GetBind = ApiContent[ContentKey];
                    let AddBind = {};
                    let BindType = typeof GetBind;
                    switch (BindType) {
                        case 'object':
                            AddBind[ApiKey] = {
                                ...GetBind
                            };
                            break;
                        case 'string':
                            AddBind[ApiKey] = {
                                '.': GetBind
                            };
                            break;
                        default:
                            throw new Error('bind set type error');
                    }
                    delete ApiContent[ContentKey];
                    this.AddVc_Config_Bind(VcName, AddBind);
                    continue;
                }
                delete ApiContent[ContentKey];
            }
        }
        return Api;
    }
    _ClearConfig_Bind(Bind) {
        let AllStoreKey = Object.keys(Bind);
        for (let i = 0; i < AllStoreKey.length; i++) {
            let StoreKey = AllStoreKey[i];
            this._CheckConfig_Bind(Bind, StoreKey);
        }
        return Bind;
    }
    _CheckConfig_Bind(Bind, StoreKey) {
        let StoreBind = Bind[StoreKey];
        let AllKeys = Object.keys(StoreBind);
        let ClearCommands = [];
        for (let i = 0; i < AllKeys.length; i++) {
            let OrgLeftCommand = AllKeys[i];
            let LeftCommand = OrgLeftCommand;
            let LeftCommandInfo = this._CheckRequired_LeftCommandInfo(LeftCommand);
            LeftCommand = LeftCommandInfo.ConvertCommand;

            let RightCommand = StoreBind[OrgLeftCommand];

            let RightCommandInfos = [];
            if (LeftCommandInfo.CommandName == 'target')
                RightCommandInfos = this._AnalyzeCommandInfos_MainTarget(RightCommand);
            else
                RightCommandInfos = this._AnalyzeCommandInfos_MainMode(RightCommand);

            let TotalCommandInfo = this._CheckRequired_RightCommandInfos(LeftCommandInfo, RightCommandInfos);
            ClearCommands.splice(ClearCommands.length, 0, ...TotalCommandInfo);
        }

        Bind[StoreKey] = {};
        StoreBind = Bind[StoreKey];
        for (let i = 0; i < ClearCommands.length; i++) {
            let Command = ClearCommands[i];
            let Target = Command['target'];

            if (Target in StoreBind)
                throw new Error(`target「${Target}」is already set`);

            StoreBind[Target] = Command;
        }

    }

    _CheckRequired_LeftCommandInfo(LeftCommand) {
        if (!LeftCommand.includes(':'))
            LeftCommand = `t:${LeftCommand}`;

        let CommandInfo = this._Analyze_CommandInfo(LeftCommand);
        switch (CommandInfo.CommandName) {
            case 'target':
            case 'mode':
                break;
            default:
                throw new Error(`error CommandName for LeftCommand of「${CommandInfo.Command}」`);
        }

        return CommandInfo;
    }
    _CheckRequired_RightCommandInfos(LeftCommandInfo, RightCommandInfos) {

        let TotalCommandInfo = [];
        for (let i = 0; i < RightCommandInfos.length; i++) {
            let CommandInfo = RightCommandInfos[i];
            CommandInfo[LeftCommandInfo['CommandName']] = LeftCommandInfo['CommandValue'];
            let InfoResult = this._CheckRequired_CommandInfo(CommandInfo);
            TotalCommandInfo.push(InfoResult);
        }

        return TotalCommandInfo;
    }
    _CheckRequired_CommandInfo(CommandInfo) {

        let TryGetTarget = CommandInfo['target'];
        let TryGetColumn = CommandInfo['column'];
        CommandInfo['target'] = TryGetTarget ?? TryGetColumn;
        CommandInfo['column'] = TryGetColumn ?? TryGetTarget;

        if ('target' in CommandInfo === false)
            throw new Error('the「target、column」command is required, at least one of the param needs to be set');

        if ('column' in CommandInfo === false)
            throw new Error('the「target、column」command is required, at least one of the param needs to be set');

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

        if (!Command.includes(':'))
            throw new Error(`command not contains「:」of「${Command}」`)

        let CommandArray = Command
            .replaceAll(' ', '')
            .split(':');

        if (CommandArray.length > 2)
            throw new Error(`_Analyze_CommandInfo() only can analyze single command of「${Command}」`);

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
            case 'target':
            case 't':
                CommandName = 'target';
                break;

            case 'mode':
            case 'm':
                CommandName = 'mode';
                break;

            case 'column':
            case 'col':
            case 'c':
                CommandName = 'column';
                break;

            case 'option':
            case 'opt':
            case 'o':
                CommandName = 'option';
                break;

            case 'value':
            case 'v':
                CommandName = 'value';
                break;

            case 'display':
            case 'd':
                CommandName = 'display';
                break;
            default:
                throw new Error(`error CommandName of「${CommandName}」`);
        }
        return CommandName;
    }
    _AnalyzeCommandInfos_MainTarget(RightCommand) {

        RightCommand = this._AnalyzeCommandInfos_ConvertString(RightCommand);
        if (RightCommand.includes('[') || RightCommand.includes(']'))
            throw new Error(`when LeftCommand is MainTraget mode, RightCommand can't split group of「${RightCommand}」`);

        let CommandArray = RightCommand
            .replaceAll(' ', '')
            .split(',');

        let CommandInfo = {};
        for (let i = 0; i < CommandArray.length; i++) {
            let GetCommand = CommandArray[i];
            if (!GetCommand.includes(':'))
                GetCommand = `c:${GetCommand}`;

            let GetInfo = this._Analyze_CommandInfo(GetCommand);
            CommandInfo[GetInfo.CommandName] = GetInfo.CommandValue;
        }

        let CommandInfos = [CommandInfo];
        return CommandInfos;
    }
    _AnalyzeCommandInfos_MainMode(RightCommand) {
        RightCommand = this._AnalyzeCommandInfos_ConvertString(RightCommand);
        let ParamGroups = RightCommand
            .replaceAll(' ', '')
            .split(/[\[\]]/);

        let CommandInfos = [];
        for (let i = 0; i < ParamGroups.length; i++) {
            let Group = ParamGroups[i];
            let CommandArray = Group.split(',');

            let SetCommandInfo = {};
            for (let j = 0; j < CommandArray.length; j++) {
                let GetCommand = CommandArray[j];
                if (!GetCommand.includes(':'))
                    GetCommand = `t:${GetCommand}`;

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
            let CommandString = CommandArray.join(',');
            return CommandString;
        }

        throw new Error('error command type');
    }

    //#endregion
}
const Vc = new VcController();