﻿/**
 *  VcController.js v1.0.2
 *  From Rugal Tu
 *  Based on VueModel.js
 * */

class VcController extends CommonFunc {

    constructor() {
        super();

        this.Configs = {};
        this.IsConfigDone = false;
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
    AddVc_Config(_Config = { VcName: null, Api: {}, Bind: {}, AutoBind: {} }) {
        let VcName = _Config['VcName'] ?? this.DefaultVcName;
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName], _Config);

        this._ClearConfig();
        return this;
    }

    AddVc_Config_Api(_Api) {
        let VcName = _Config['VcName'] ?? this.DefaultVcName;
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName]['Api'], _Api);
        this._ClearConfig(VcName);
        return this;
    }

    AddVc_Config_Bind(VcName, _Bind) {
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName]['Bind'], _Bind);
        this._ClearConfig(VcName);
        return this;
    }

    AddVc_Config_AutoBind(VcName, _AutoBind) {
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName]['AutoBind'], _AutoBind);
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
            this._SetAutoBind();
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
            this._ForEachKeyValue(Config['Api'], (ApiKey, ApiContent) => {
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
            this._ForEachKeyValue(Config['Bind'], (StoreKey, StoreSet) => {
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

        let SkipChar = ['.', '(', ')'];
        if (SkipChar.filter(Item => SetStoreKey.includes(Item)).length == 0)
            SetStoreKey = `${StoreKey}.${From}`;

        let GetDoms = this._DomsWhere_VcCol(VcName, Column);

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
                this.Model.AddVdom_For(GetDoms, From);
                break;
        }
    }

    _SetAutoBind() {
        this._ForEachKeyValue(this.Configs, (VcName, Config) => {
            this._ForEachKeyValue(Config['AutoBind'], (StoreKey, BindSet) => {
                let BindArray = BindSet;
                if (!Array.isArray(BindSet))
                    BindArray = [BindSet];

                BindArray.forEach(Item => {
                    this._VueModel_AutoBindSet(VcName, StoreKey, Item);
                });
            });
        });
        return this;
    }
    _VueModel_AutoBindSet(VcName, StoreKey, BindSet) {
        let Query = BindSet['query'] ?? `[vc-col]`;
        let From = BindSet['from'] ?? `{vc-col}`;
        let Mode = BindSet['mode'] ?? 'text';

        let Doms = this._DomsWhere(VcName, Query);
        switch (Mode) {
            case 'text':
                this.Model.AddVdom_AutoBind_Text(Doms, From, StoreKey);
                break;
            case 'input':
                this.Model.AddVdom_AutoBind_Input(Doms, From, StoreKey);
                break;
        }

        return;
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

        if (!('AutoBind' in GetConfig))
            GetConfig['AutoBind'] = {};

        return this;
    }
    _ClearConfig(_VcName = null) {
        let AllVcName = Object.keys(this.Configs);
        if (_VcName != null)
            AllVcName = [_VcName];

        AllVcName.forEach(VcName => {
            let GetConfig = this.Configs[VcName];

            let Api = GetConfig['Api'];
            this._ClearConfig_Api(VcName, Api);

            let Bind = GetConfig['Bind'];
            this._ClearConfig_Bind(Bind);

            let AutoBind = GetConfig['AutoBind'];
            this._ClearConfig_AutoBind(AutoBind);
        });
        return this;
    }
    _ClearConfig_Api(VcName, Api) {
        this._ForEachKeyValue(Api, (ApiKey, ApiContent) => {
            let ApiProp = ['Url', 'Type'];

            this._ForEachKeyValue(ApiContent, (ContentKey, Item) => {
                if (ApiProp.includes(ContentKey))
                    return;

                delete ApiContent[ContentKey];
                if (ContentKey == 'Bind') {
                    if (!this._HasAnyKeys(Item))
                        return;
                    let AddBind = {};
                    if (typeof Item != 'object')
                        this._Throw('bind set type error');

                    AddBind[ApiKey] = {
                        ...Item
                    };
                    this.AddVc_Config_Bind(VcName, AddBind);
                }
                else if (ContentKey == 'AutoBind') {
                    if (!this._HasAnyKeys(Item))
                        return;
                    let AddAutoBind = {};
                    AddAutoBind[ApiKey] = Item;
                    this.AddVc_Config_AutoBind(VcName, AddAutoBind);
                }

            })
        });
        return Api;
    }
    _ClearConfig_Bind(Bind) {
        this._ForEachKeyValue(Bind, StoreKey => {
            let StoreBind = Bind[StoreKey];
            let ClearCommands = [];
            this._ForEachKeyValue(StoreBind, (OrgLeftCommand, RightCommand) => {
                let LeftCommand = OrgLeftCommand;
                let LeftCommandInfo = this._Analyze_CommandInfo(LeftCommand);
                this._CheckRequired_LeftCommandInfo(LeftCommandInfo);

                LeftCommand = LeftCommandInfo.ConvertCommand;

                let RightCommandInfos = this._Analyze_RightCommandInfos(RightCommand);

                let FullCommandInfos = this._Convert_FullCommandInfos(LeftCommandInfo, RightCommandInfos, StoreKey);
                ClearCommands.splice(ClearCommands.length, 0, ...FullCommandInfos);
            });

            Bind[StoreKey] = {};
            StoreBind = Bind[StoreKey];

            ClearCommands.forEach(Command => {
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
            });
        });
        return Bind;
    }
    _ClearConfig_AutoBind(AutoBind) {
        if (AutoBind == null)
            return null;

        this._ForEachKeyValue(AutoBind, (StoreKey, BindSet) => {
            AutoBind[StoreKey] = null;

            let CommandGroups = [];
            if (Array.isArray(BindSet))
                CommandGroups = BindSet;
            else
                CommandGroups = [BindSet];

            CommandGroups.forEach(Command => {
                let AutoBindInfo = this._Analyze_AutoBindInfo(Command);

                let GetBind = AutoBind[StoreKey];
                if (GetBind == null)
                    AutoBind[StoreKey] = AutoBindInfo;
                else {
                    if (Array.isArray(GetBind))
                        GetBind.push(AutoBindInfo);
                    else {
                        AutoBind[StoreKey] = [GetBind, AutoBindInfo];
                    }
                }
            });
        });

        return AutoBind;
    }

    _CheckRequired_LeftCommandInfo(LeftCommandInfo) {
        switch (LeftCommandInfo.CommandName) {
            case 'column':
                break;
            default:
                this._Throw(`error CommandName for LeftCommand of「${LeftCommandInfo.Command}」`)
        }
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

            //#region Common
            case 'from':
            case 'f':
                CommandName = 'from';
                break;

            case 'mode':
            case 'm':
                CommandName = 'mode';
                break;

            case 'column':
            case 'col':
                CommandName = 'column';
                break;
            //#endregion

            //#region Select
            case 'select':
            case 'sel':
                CommandName = 'select';
                break;

            case 'option':
            case 'opt':
                CommandName = 'option';
                break;

            case 'to':
                CommandName = 'to';
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

            //#region AutoBind
            case 'query':
            case 'q':
                CommandName = 'query';
                break;
            //#endregion

            default:
                throw new Error(`error CommandName of「${CommandName}」`);
        }
        return CommandName;
    }
    _Analyze_RightCommandInfos(RightCommand) {

        let ParamGroups = [];
        if (Array.isArray(RightCommand)) {
            ParamGroups = RightCommand
                .map(Item => this._Convert_CommandInfo_CommandString(Item));
        }
        else {
            RightCommand = this._Convert_CommandInfo_CommandString(RightCommand);
            ParamGroups = RightCommand
                .replaceAll(' ', '')
                .split(/[\[\]]/);
        }

        let CommandInfos = ParamGroups.map(Group => {
            let CommandArray = Group
                .split(';')
                .filter(Item => !this._IsNullOrEmpty(Item));

            let SetCommandInfo = {};
            CommandArray.forEach(GetCommand => {
                if (!GetCommand.includes(':'))
                    this._Throw('CommandName is a required parameter in CommandLine mode.');

                let GetInfo = this._Analyze_CommandInfo(GetCommand);
                SetCommandInfo[GetInfo.CommandName] = GetInfo.CommandValue;
            });

            return SetCommandInfo;
        })

        return CommandInfos;
    }
    _Analyze_AutoBindInfo(Command) {
        Command = this._Convert_CommandInfo_CommandString(Command);

        let CommandArray = Command
            .replaceAll(' ', '')
            .split(';')
            .filter(Item => !this._IsNullOrEmpty(Item));

        let AutoBindInfo = {};
        CommandArray.forEach(Command => {
            if (!Command.includes(':'))
                this._Throw('CommandName is a required parameter in CommandLine mode.');

            let CommandInfo = this._Analyze_CommandInfo(Command);
            AutoBindInfo[CommandInfo.CommandName] = CommandInfo.CommandValue;
        });

        return AutoBindInfo;
    }

    _Convert_CommandInfo_CommandString(BindCommand) {
        if (typeof BindCommand === 'string')
            return BindCommand;

        if (typeof BindCommand === 'object') {
            let CommandArray = [];
            let AllKeys = Object.keys(BindCommand);
            for (let i = 0; i < AllKeys.length; i++) {
                let Key = AllKeys[i];
                let Value = BindCommand[Key];
                CommandArray.push(`${Key}:${Value}`);
            }
            let CommandString = CommandArray.join(';');
            return CommandString;
        }

        throw new Error('error command type');
    }
    _Convert_FullCommandInfos(LeftCommandInfo, RightCommandInfos, StoreKey) {
        let FullCommandInfos = RightCommandInfos
            .map(CommandInfo => {
                let LeftCommandName = LeftCommandInfo['CommandName'];
                CommandInfo[LeftCommandName] = LeftCommandInfo['CommandValue'];

                let InfoResult = this._CheckRequired_CommandInfo(CommandInfo, StoreKey);
                return InfoResult;
            });

        return FullCommandInfos;
    }
    //#endregion

    //#region Doms Where
    _DomsWhere(VcName, ...WhereAnd) {
        let GetDom = this.Dom;
        if (this.IsUseQueryWhere_VcName)
            GetDom.WithAttr('vc-name', VcName);

        WhereAnd.forEach(Item => {
            GetDom.WithCustom(Item);
        });

        return GetDom;
    }
    _DomsWhere_VcCol(VcName, VcCol, ...WhereAnd) {
        let GetDom = this.Dom;
        if (this.IsUseQueryWhere_VcName)
            GetDom.WithAttr('vc-name', VcName);

        GetDom.WithAttr('vc-col', VcCol);
        WhereAnd.forEach(Item => {
            GetDom.WithCustom(Item);
        });

        return GetDom;
    }
    //#endregion
}
const Vc = new VcController();