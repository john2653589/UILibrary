﻿/**
 *  VueModel.js v2.0.12
 *  From Rugal Tu
 *  Based on Vue3, CommonFunc.js, DomEditor.js
 *  Update 2023/06/29
 * */
const { createApp } = Vue
const Dom = new DomEditor();

class VueModel extends CommonFunc {

    constructor() {
        super();
        this.Store = {
            FileStore: {},
        };
        this.ApiStore = {}
        this.VueOption = {
            methods: {},
        };

        this.BindElementId = 'BindApp';
        this.DefaultStoreKey = 'Default';
        this.WithDefaultStore(this.DefaultStoreKey);
        this.VueProxy = null;
        this.IsInited = false;
        this.GetToken = undefined;
        this.AcceptAutoBindTag_Input = ['input', 'textarea'];
        this.AcceptAutoBindTag_Text = ['div', 'label', 'span'];
        this.AcceptAutoBindTag_Select = ['select'];
        this.AcceptAutoBindTag_File = ['input'];

        this.AcceptAutoBindType_File = ['file'];

        this.ExceptAutoBindType_Input = ['file'];

        this.FuncKey_FormatDate = 'Format_Date';
        this._Domain = null;
        this._Token = null;

        this._Func_ConvertTo_FormParam = [];
    }

    //#region Property
    get Dom() {
        return new DomEditor();
    }

    get Domain() {
        if (this._Domain == null)
            return null;
        return this._GetClearDomain(this._Domain);
    }
    set Domain(_Domain) {
        this._Domain = this._GetClearDomain(_Domain);
    }

    get FileStore() {
        return this.Store.FileStore;
    }
    //#endregion

    //#region Init
    Init() {
        if (!this.IsInited) {
            let GetStore = this.Store;
            let SetStore = {
                ...GetStore,
                //Format_Date: (DateValue, StoreKey) => {
                //    if (DateValue != undefined) {
                //        let SetValue = DateValue.replaceAll('/', '-');
                //        this.UpdateStore(SetValue, StoreKey);
                //    }
                //}
            };
            let SetVueOption = {
                ...this.VueOption,
                data() {
                    return SetStore;
                },
            };
            this.VueProxy = createApp(SetVueOption)
                .mount(`#${this.BindElementId}`);
            this.IsInited = true;
        }
        return this;
    }
    WithDefaultStore(_DefaultStoreKey) {
        this.DefaultStoreKey = _DefaultStoreKey;
        this.Store[this.DefaultStoreKey] ??= {};
        return this;
    }
    WithStoreData(_StoreData) {
        this.Store = _StoreData;
        return this;
    }
    WithRootId(_BindElementId = 'BindApp') {
        this.BindElementId = _BindElementId;
        return this;
    }
    WithVueOption(_VueOption = {}) {
        this.VueOption = _VueOption;
        return this;
    }
    WithDomain(_Domain) {
        this.Domain = _Domain;
        return this;
    }
    WithToken(_Token) {
        this._Token = _Token;
        return this;
    }
    WithConvertTo_FormParam(ConvertToFunc = (FormParam, Form) => { }) {
        this._Func_ConvertTo_FormParam.push(ConvertToFunc);
        return this;
    }
    WithJsonFormParam(JsonKey = 'Result') {
        this.WithConvertTo_FormParam((FormParam, Form) => {
            let ConvertParam = {};
            ConvertParam[JsonKey] = JSON.stringify(FormParam);
            return ConvertParam;
        });
        return this;
    }
    Using(UseFunc = () => { }) {
        UseFunc();
        return this;
    }
    //#endregion

    //#region Add Vue Command

    //#region Text
    AddV_Text(DomId, StoreKey = null) {
        this.AddVdom_Text(this.Dom.WithId(DomId), StoreKey ?? DomId);
        return this;
    }
    AddVq_Text(QueryString, StoreKey = null) {
        this.AddVdom_Text(this.Dom.WithCustom(QueryString), StoreKey);
        return this;
    }
    AddVcol_Text(ColName, StoreKey = null) {
        this.AddVdom_Text(this.Dom.WithAttr('vc-col', ColName), StoreKey ?? ColName);
        return this;
    }
    AddVdom_Text(Dom, ...StoreKey) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        StoreKey = this._ReCombineStoreKey(StoreKey);
        this.AddStore(StoreKey, null);
        GetDom.SetAttr('v-text', StoreKey);
        return this;
    }
    //#endregion

    //#region Input
    AddV_Input(DomId, StoreKey = null) {
        this.AddVdom_Input(this.Dom.WithId(DomId), StoreKey ?? DomId);
        return this;
    }
    AddVq_Input(QueryString, StoreKey = null) {
        this.AddVdom_Input(this.Dom.WithCustom(QueryString), StoreKey);
        return this;
    }
    AddVdom_Input(Dom, ...StoreKey) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        StoreKey = this._ReCombineStoreKey(StoreKey);
        this.AddStore(StoreKey, null);
        GetDom.ForEach(Item => {
            let VModelCommand = 'v-model';
            switch (Item.type) {
                case 'datetime':
                case 'datetime-local':
                case 'date':
                    this.AddVdom_Format(GetDom, this.FuncKey_FormatDate, StoreKey, `'${StoreKey}'`);
                    break;
                case 'number':
                    VModelCommand = 'v-model.number';
                    break;
            }
            GetDom.SetElement_Attr(Item, VModelCommand, StoreKey);
        });
        return this;
    }
    //#endregion

    //#region Select
    AddV_Select(Option = {
        SelectId: null,
        From: null,
        To: null,
        OptionId: null,
        Display: null,
        Value: null,
    }) {
        let SelectQuery = this.Dom._QueryString_Id(Option.SelectId);
        let OptionQuery = this.Dom._QueryString_Id(Option.OptionId);

        this.AddVq_Select({
            SelectQuery,
            OptionQuery,
            From: Option.From,
            To: Option.To,
            Display: Option.Display,
            Value: Option.Value,
        });
        return this;
    }
    AddVcol_Select(Option = {
        SelectCol: null,
        OptionCol: null,
        From: null,
        To: null,
        Display: null,
        Value: null,
    }) {
        Option.From = Option.From ?? Option.SelectCol;
        Option.To = Option.To ?? Option.SelectCol;

        let SelectQuery = this.Dom._QueryString_VcCol(Option.SelectCol);
        let OptionQuery = this.Dom._QueryString_VcCol(Option.OptionCol);
        this.AddVq_Select({
            SelectQuery,
            OptionQuery,
            From: Option.From,
            To: Option.To,
            Display: Option.Display,
            Value: Option.Value,
        });
        return this;
    }
    AddVq_Select(Option = {
        SelectQuery: null,
        From: null,
        To: null,
        OptionQuery: null,
        Display: null,
        Value: null,
    }) {

        this.AddStore(Option.To, null);
        this.UpdateStore([], Option.From, true);
        let SelectDom = this.Dom
            .WithCustom(Option.SelectQuery)
            .ForEach(Item => {
                if (Option.From.toLowerCase() != '-html') {
                    let Display = this._ReCombineItemKey(Option.Display);
                    let Value = this._ReCombineItemKey(Option.Value);

                    this.Dom.NewWithElement([...Item.children])
                        .WhereCustom(Option.OptionQuery)
                        .SetAttr('v-text', Display)
                        .SetAttr(':value', Value)
                        .SetAttr('v-for', `(Item, Idx) in ${Option.From}`);
                }
                let StoreKey = this._ReCombineStoreKey(Option.To);
                this.Dom.SetElement_Attr(Item, 'v-model', StoreKey);
            })
        return this;
    }
    //#endregion

    //#region Select Html
    AddV_SelectHtml(SelectId, To) {
        this.AddVdom_SelectHtml(this.Dom.WithId(SelectId), To ?? SelectId);
        return this;
    }
    AddVq_SelectHtml(QueryString, To) {
        this.AddVdom_SelectHtml(this.Dom.WithCustom(QueryString), To);
        return this;
    }
    AddVdom_SelectHtml(Dom, To) {
        To = this._ReCombineStoreKey(To);
        this.AddStore(To, null);
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-model', To);
        return this;
    }
    //#endregion

    //#region For
    AddV_For(DomId, StoreKey) {
        this.AddVdom_For(this.Dom.WithId(DomId), StoreKey ?? DomId);
        return this;
    }
    AddVq_For(QueryString, StoreKey) {
        this.AddVdom_For(this.Dom.WithCustom(QueryString), StoreKey);
        return this;
    }
    AddVcol_For(ColName, StoreKey) {
        this.AddVdom_For(this.Dom.WithAttr('vc-col', ColName), StoreKey);
        return this;
    }
    AddVdom_For(Dom, StoreKey) {
        let GetStore = this._RCS_GetStore(StoreKey, this.Store);
        if (GetStore == null)
            this.AddStore(StoreKey, []);
        else if (!Array.isArray(GetStore))
            this.UpdateStore([], StoreKey, true);

        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-for', `(Item, Idx) in ${StoreKey}`);
        return this;
    }
    //#endregion

    //#region Input-File
    AddV_File(DomId, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithId(DomId), FileStoreKey ?? DomId, Option);
        return this;
    }
    AddVq_File(QueryString, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithCustom(QueryString), FileStoreKey, Option);
        return this;
    }
    AddVcol_File(ColName, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithAttr('vc-col', ColName), FileStoreKey ?? ColName, Option);
        return this;
    }
    AddVdom_File(Dom, FileStoreKey, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddFileStore(FileStoreKey);
        let { IsAddMode, ConverFileFunc } = Option;

        this.AddVdom_OnChange(Dom, Input => {
            let Files = [...Input.target.files];
            if (!IsAddMode)
                this.FileStore[FileStoreKey] = [];
            else
                Input.target.value = '';

            let AddFiles = Files.map(Item => {

                let ConvertFile = {
                    FileId: this._GenerateId(),
                    File: Item,
                };
                if (ConverFileFunc != null)
                    ConverFileFunc(Item, ConvertFile);

                return ConvertFile;
            });

            this.FileStore[FileStoreKey].push(...AddFiles);
            this._UpdateVueStore();
        });
        return this;
    }
    //#endregion

    //#region If Render
    AddVcol_If(ColName, IfValue) {
        this.AddVdom_If(this.Dom.WithAttr('vc-col', ColName), IfValue);
        return this;
    }
    AddVdom_If(Dom, IfValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-if', IfValue);
        return this;
    }
    //#endregion

    //#region Show Render
    AddVcol_Show(ColName, ShowValue) {
        this.AddVdom_Show(this.Dom.WithAttr('vc-col', ColName), ShowValue);
        return this;
    }
    AddVdom_Show(Dom, ShowValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-show', ShowValue);
        return this;
    }
    //#endregion

    //#region Add Function Format
    AddV_Function(FuncKey, Func) {
        this.VueOption.methods[FuncKey] = Func;
        return this;
    }
    AddV_Format(DomId, FuncKey, ...Params) {
        this.AddVdom_Format(this.Dom.WithId(DomId), FuncKey, Params ?? DomId);
        return this;
    }
    AddVq_Format(QueryString, FuncKey, ...Params) {
        this.AddVdom_Format(this.Dom.WithCustom(QueryString), FuncKey, Params);
        return this;
    }
    AddVdom_Format(_Dom, FuncKey, ...Params) {
        Params = Params.join(',');
        let GetDom = this._BaseCheck_DomEditor(_Dom);
        GetDom.SetAttr(':formatter', `${FuncKey}(${Params})`);
        return this;
    }
    //#endregion

    //#region Base Format Function
    AddBase_Format_Date() {
        this.AddV_Function(this.FuncKey_FormatDate, (DateValue, StoreKey) => {
            let SetValue = DateValue;
            if (DateValue != undefined) {
                SetValue = DateValue.replaceAll('/', '-').replaceAll('T', ' ');
            }
            if (DateValue != SetValue)
                this.UpdateStore(SetValue, StoreKey);
        })
        return this;
    }
    //#endregion

    //#region On Event
    AddV_OnChange(DomId, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithId(DomId), ChangeFunc, FuncParam);
        return this;
    }
    AddVq_OnChange(QueryString, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithCustom(QueryString), ChangeFunc, FuncParam);
        return this;
    }

    AddVcol_OnChange(ColName, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithAttr('vc-col', ColName), ChangeFunc, FuncParam);
        return this;
    }

    AddVdom_OnChange(Dom, ChangeFunc, FuncParam = null) {
        if (ChangeFunc == null)
            this._Throw('Change function cannot be null');

        let GetDom = this._BaseCheck_DomEditor(Dom);

        let FuncName = this._GetRandomFuncName('OnChange')
        this.AddV_Function(FuncName, ChangeFunc);

        let SetFuncKey = FuncName;
        if (FuncParam != null)
            SetFuncKey = `${SetFuncKey}(${FuncParam})`;

        GetDom.SetAttr(`v-on:change`, SetFuncKey);
        return this;
    }
    //#endregion

    //#region Bind
    AddV_Bind(DomId, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithId(DomId), BindKey, BindValue);
        return this;
    }
    AddVcol_Bind(ColName, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithAttr('vc-col', ColName), BindKey, BindValue);
        return this;
    }
    AddVq_Bind(QueryString, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithCustom(QueryString), BindKey, BindValue);
        return this;
    }
    AddVdom_Bind(Dom, BindKey, BindValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(`v-bind:${BindKey}`, BindValue);
        return this;
    }
    //#endregion

    //#region Click
    AddV_Click(DomId, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithId(DomId), ClickFunc, FuncParam);
        return this;
    }
    AddVq_Click(QueryString, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithCustom(QueryString), ClickFunc, FuncParam);
        return this;
    }
    AddVcol_Click(ColName, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithAttr('vc-col', ColName), ClickFunc, FuncParam);
        return this;
    }
    AddVdom_Click(Dom, ClickFunc, FuncParam = null) {
        if (ClickFunc == null)
            this._Throw('Click function cannot be null');
        let GetDom = this._BaseCheck_DomEditor(Dom);

        let FuncName = this._GetRandomFuncName('Func')
        this.AddV_Function(FuncName, ClickFunc);

        let SetFuncKey = FuncName;
        if (FuncParam != null)
            SetFuncKey = `${SetFuncKey}(${FuncParam})`;

        GetDom.SetAttr(`v-on:click`, SetFuncKey);
        return this;
    }
    //#endregion

    //#endregion

    //#region AutoBind

    //#region AutoBind Text
    AddVq_AutoBind_Text(QueryString, BindFrom, StoreKey) {
        this.AddVdom_AutoBind_Text(this.Dom.WithCustom(QueryString), BindFrom, StoreKey);
        return this;
    }
    AddVdom_AutoBind_Text(Dom, BindFrom, StoreKey) {
        StoreKey = StoreKey ?? this.DefaultStoreKey;
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.ForEach(Item => {
            let TagName = Item.tagName.toLowerCase();
            if (!this.AcceptAutoBindTag_Text.includes(TagName))
                return;

            let SetStoreKey = this._Analyze_AutoBind_From(Item, BindFrom);
            if (this._IsClearSotreKey(SetStoreKey))
                SetStoreKey = `${StoreKey}.${SetStoreKey}`;

            this.AddVdom_Text(GetDom.NewWithElement(Item), SetStoreKey);
        });
        return this;
    }
    //#endregion

    //#region AutoBind Input
    AddVq_AutoBind_Input(QueryString, BindFrom, StoreKey) {
        this.AddVdom_AutoBind_Input(this.Dom.WithCustom(QueryString), BindFrom, StoreKey);
        return this;
    }
    AddVdom_AutoBind_Input(Dom, BindFrom, StoreKey) {
        StoreKey = StoreKey ?? this.DefaultStoreKey;
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.ForEach(Item => {
            let TagName = Item['tagName'].toLowerCase();
            if (!this.AcceptAutoBindTag_Input.includes(TagName))
                return;

            let Type = Item['type'].toLowerCase();
            if (this.ExceptAutoBindType_Input.includes(Type))
                return;

            let SetStoreKey = this._Analyze_AutoBind_From(Item, BindFrom);
            if (this._IsClearSotreKey(SetStoreKey))
                SetStoreKey = `${StoreKey}.${SetStoreKey}`;
            this.AddVdom_Input(GetDom.NewWithElement(Item), SetStoreKey);
        });
        return this;
    }
    //#endregion

    //#region AutoBind Select-Html
    AddVq_AutoBind_SelectHtml(QueryString, BindFrom, StoreKey) {
        this.AddVdom_AutoBind_SelectHtml(this.Dom.WithCustom(QueryString), BindFrom, StoreKey);
        return this;
    }
    AddVdom_AutoBind_SelectHtml(Dom, BindFrom, StoreKey) {
        StoreKey = StoreKey ?? this.DefaultStoreKey;
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.ForEach(Item => {
            let TagName = Item.tagName.toLowerCase();
            if (!this.AcceptAutoBindTag_Select.includes(TagName))
                return;

            let SetStoreKey = this._Analyze_AutoBind_From(Item, BindFrom);
            if (this._IsClearSotreKey(SetStoreKey))
                SetStoreKey = `${StoreKey}.${SetStoreKey}`;
            this.AddVdom_SelectHtml(GetDom.NewWithElement(Item), SetStoreKey);
        });
        return this;
    }
    //#endregion

    //#region AutoBind File
    AddVq_AutoBind_File(QueryString) {
        this.AddVdom_AutoBind_File(this.Dom.WithCustom(QueryString));
        return this;
    }
    AddVdom_AutoBind_File(Dom) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.ForEach(Item => {
            let TagName = Item['tagName'].toLowerCase();
            if (!this.AcceptAutoBindTag_File.includes(TagName))
                return;

            let Type = Item['type'].toLowerCase();
            if (!this.AcceptAutoBindType_File.includes(Type))
                return;

            let ColName = GetDom.GetElement_Attr(Item, 'vc-col');
            this.AddVdom_File(GetDom.NewWithElement(Item), ColName);
        });
        return this;
    }
    //#endregion

    //#region Common Func
    _Analyze_AutoBind_From(Element, BindFrom) {

        let MatchChar = /(\{.+?\})/;
        let FromArray = BindFrom
            .split(MatchChar)
            .filter(Item => !this._IsNullOrEmpty(Item));

        let FormatArray = FromArray
            .map(Item => {
                if (Item.match(MatchChar) == null)
                    return Item;

                let GetAttrName = Item.replace(/{(.+?)}/g, '$1');
                let AttrValue = Dom.GetElement_Attr(Element, GetAttrName);
                return AttrValue;
            });

        let ClearBind = FormatArray.join('');
        return ClearBind;
    }
    //#endregion

    //#endregion

    //#region Base Add Vue Command
    _BaseCheck_DomEditor(CheckDom) {
        if (CheckDom instanceof DomEditor) {
            return CheckDom;
        }
        throw new Error('error DomEditor type');
    }
    //#endregion

    //#region Store Data Controller
    UpdateStore(StoreData, StoreKey, IsReplace = false) {
        StoreKey = this._TryGetStoreKey(StoreKey);

        StoreData ??= {};

        StoreData = this._TryToJson(StoreData);

        this._RCS_SetStore(StoreKey, StoreData, this.Store, IsReplace);
        this._UpdateVueStore();
        return this;
    }
    AddStore(StoreKey, StoreData = {}) {
        if (this._RCS_GetStore(StoreKey, this.Store) != null)
            return this;

        this._RCS_SetStore(StoreKey, StoreData, this.Store, true);
        this._UpdateVueStore();
        return this;
    }
    AddFileStore(FileStoreKey) {
        if (this.FileStore[FileStoreKey] == null)
            this.FileStore[FileStoreKey] = [];
        return this;
    }
    Files(FileStoreKey, MapFunc = null) {
        let GetFiles = this.FileStore[FileStoreKey];
        if (GetFiles == null)
            return [];

        let MapFiles = MapFunc != null ?
            GetFiles.map(Item => MapFunc(Item)) :
            GetFiles.map(Item => Item['File']);

        return MapFiles;
    }

    _RCS_GetStore(StoreKey, FindStore) {
        if (FindStore == null)
            return null;

        if (!StoreKey.includes('.'))
            return this.Store[StoreKey];

        let FirstKey = StoreKey.split('.')[0];
        let NextKey = StoreKey.replaceAll(`${FirstKey}.`);
        return this._RCS_GetStore(NextKey, FindStore[FirstKey]);
    }
    _RCS_SetStore(StoreKey, StoreData, FindStore, IsReplace) {
        if (!StoreKey.includes('.')) {
            if (!(StoreKey in FindStore) || IsReplace) {
                this._BaseSetStoreObject(StoreData, StoreKey, FindStore);
            }
            else {
                let GetStore = FindStore[StoreKey];
                let SetStore = StoreData;

                if (typeof GetStore != 'object')
                    FindStore[StoreKey] = SetStore;
                else {
                    this._BaseSetStoreObject(StoreData, StoreKey, FindStore);
                }
            }
            return FindStore[StoreKey];
        }
        else {
            let FirstKey = StoreKey.split('.')[0];
            let NextKey = StoreKey.replaceAll(`${FirstKey}.`, '');
            if (FindStore[FirstKey] == null) {
                FindStore[FirstKey] = {};
            }
            return this._RCS_SetStore(NextKey, StoreData, FindStore[FirstKey], IsReplace);
        }
    }
    _BaseSetStoreObject(SetData, StoreKey, FindStore) {
        if (FindStore[StoreKey] == null || typeof SetData != 'object' || Array.isArray(SetData)) {
            if (!Array.isArray(SetData))
                FindStore[StoreKey] = SetData;
            else {
                if (!Array.isArray(FindStore[StoreKey]))
                    FindStore[StoreKey] = [];
                FindStore[StoreKey].splice(0, FindStore[StoreKey].length);
                FindStore[StoreKey].push(...SetData);
            }
        }
        else {
            this._ForEachKeyValue(SetData, (Key, Value) => {
                FindStore[StoreKey][Key] = Value;
            });
        }
    }
    _UpdateVueStore() {
        this.VueProxy?.$forceUpdate();
    }
    //#endregion

    //#region Api Store Controller
    AddApi_Get(_ApiKey, _Url, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        this._Add_Api(_ApiKey, _Url, 'GET', _OnSuccess, _OnComplete, _OnError);
        return this;
    }

    AddApi_Post(_ApiKey, _Url, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        this._Add_Api(_ApiKey, _Url, 'POST', _OnSuccess, _OnComplete, _OnError);
        return this;
    }

    ApiCall(_ApiKey, _Param = { Query: null, Body: null }, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        let Api = this.ApiStore[_ApiKey];
        let Url = this._ConvertTo_DomainUrl(Api.Url, _Param?.Query);

        let SendBody = null;
        if (_Param?.Body != null) {
            SendBody = _Param.Body;
        }

        let FetchParam = {
            method: Api.Method,
            headers: {
                'content-type': 'application/json',
                'Authorization': this._Token,
            },
        };

        if (Api.Method.toUpperCase() == 'POST')
            FetchParam['body'] = JSON.stringify(SendBody ?? {})

        fetch(Url, FetchParam)
            .then(async ApiRet => {
                if (!ApiRet.ok)
                    throw ApiRet;

                let ConvertRet = await this._ProcessApiReturn(ApiRet);
                let StoreKey = Api['ApiKey'];
                this.UpdateStore(ConvertRet, StoreKey, true);

                Api.OnSuccess?.call(this, ConvertRet);
                _OnSuccess?.call(this, ConvertRet);
                return ConvertRet;
            })
            .catch(async ex => {
                Api.OnError?.call(this, ex);
                _OnError?.call(this, ex);
                this._Throw(ex.message)
            })
            .then(async ConvertRet => {
                _OnComplete?.call(this, ConvertRet);
                Api.OnComplete?.call(this, ConvertRet);
            });

        return this;
    }

    ApiCall_Form(_ApiKey, _Param = { Query: null, Form: null, File: null }, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        let Api = this.ApiStore[_ApiKey];

        let Url = this._ConvertTo_DomainUrl(Api.Url, _Param?.Query);

        let SendForm = null;
        if (_Param?.Form != null) {
            SendForm = this._ConvertTo_FormParam(_Param.Form, SendForm);
        }

        if (_Param?.File != null) {
            SendForm = this._ConvertTo_FormFile(_Param.File, SendForm);
        }

        let FetchParam = {
            method: 'POST',
            body: SendForm,
            headers: {
                'Authorization': this._Token,
            },
        };

        fetch(Url, FetchParam)
            .then(async ApiRet => {
                if (!ApiRet.ok)
                    throw ApiRet;

                let ConvertRet = await this._ProcessApiReturn(ApiRet);

                Api.OnSuccess?.call(this, ConvertRet);
                _OnSuccess?.call(this, ConvertRet);
                return ConvertRet;
            })
            .catch(async ex => {
                Api.OnError?.call(this, ex);
                _OnError?.call(this, ex);
            })
            .then(async ConvertRet => {
                _OnComplete?.call(this, ConvertRet);
                Api.OnComplete?.call(this, ConvertRet);
            });

        return this;
    }

    _Add_Api(_ApiKey, _Url, _Method, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        let SetStore = {
            ApiKey: _ApiKey,
            Url: _Url,
            OnSuccess: _OnSuccess,
            OnComplete: _OnComplete,
            OnError: _OnError,
            Method: _Method,
        };
        this.ApiStore[_ApiKey] = SetStore;
        this.AddStore(_ApiKey);
        return SetStore;
    }
    _ProcessApiReturn(ApiRet) {
        let GetContentType = ApiRet.headers.get("content-type");
        let ConvertSuccess = null;
        if (GetContentType && GetContentType.includes('application/json')) {
            ConvertSuccess = ApiRet.json()
                .then(GetJson => GetJson);
        }
        else {
            ConvertSuccess = ApiRet.text()
                .then(GetText => GetText);
        }
        return ConvertSuccess;
    }
    _ConvertTo_DomainUrl(Url, Param = null) {
        let DomainUrl = this._GetClearUrl(Url);
        if (this.Domain != null && !DomainUrl.includes('http')) {
            DomainUrl = `${this.Domain}/${DomainUrl}`;
        }
        if (Param != null)
            DomainUrl = `${DomainUrl}?${this._ConvertTo_UrlQuery(Param)}`;

        return DomainUrl;
    }
    _ConvertTo_UrlQuery(Param) {
        if (typeof Param === 'string')
            return Param;

        let AllParam = [];
        this._ForEachKeyValue(Param, (Key, Value) => {
            AllParam.push(`${Key}=${Value}`);
        });

        let QueryString = AllParam.join('&');
        return QueryString;
    }
    _ConvertTo_FormParam(FormParam, Form = null) {

        Form ??= new FormData();

        this._Func_ConvertTo_FormParam.forEach(Func => {
            FormParam = Func(FormParam, Form);
        });

        if (FormParam instanceof FormData)
            return FormParam;

        this._ForEachKeyValue(FormParam, (Key, Value) => {
            Form.append(Key, Value);
        });
        return Form;
    }
    _ConvertTo_FormFile(FileParam, Form = null) {
        Form ??= new FormData();

        let DefaultKey = 'Files';
        if (Array.isArray(FileParam)) {
            FileParam.forEach(GetFile => {
                Form.append(DefaultKey, GetFile);
            });
        }
        else if (FileParam instanceof File) {
            Form.append(DefaultKey, FileParam);
        }
        else {
            this._ForEachKeyValue(FileParam, (Key, GetFile) => {
                if (Array.isArray(GetFile)) {
                    GetFile.forEach(File => {
                        Form.append(Key, File);
                    });
                }
                else
                    Form.append(Key, GetFile);
            });
        }
        return Form;
    }
    //#endregion

    //#region Web Page Controller
    NavigateTo(Url = [], UrlParam = null) {
        if (!Array.isArray(Url))
            Url = [Url];

        let CombineUrl = Url
            .map(Item => this._GetClearUrl(Item))
            .join('/');

        if (UrlParam != null) {
            if (typeof (UrlParam) != 'string')
                UrlParam = this._ConvertTo_UrlQuery(UrlParam);
            CombineUrl += `?${UrlParam}`;
        }
        window.location.href = CombineUrl;
    }
    //#endregion

    //#region Base Process
    _BaseReCombine(FirstKey, Params) {
        if (!Array.isArray(Params))
            Params = [Params];

        let ParamArray = Params.filter(Item => !this._IsNullOrEmpty(Item));
        if (ParamArray.length == 0)
            this._Throw('Params cannot empty');

        if (ParamArray.length == 1) {
            let GetKey = ParamArray[0];
            if (this._IsClearSotreKey(GetKey))
                ParamArray = [FirstKey, ...ParamArray];
        }

        let BindStoreKey = ParamArray.join('.');
        return BindStoreKey;
    }
    _ReCombineStoreKey(Params) {
        let BindStoreKey = this._BaseReCombine(this.DefaultStoreKey, Params);
        return BindStoreKey;
    }
    _ReCombineItemKey(Params) {
        let BindStoreKey = this._BaseReCombine('Item', Params);
        return BindStoreKey;
    }
    _IsClearSotreKey(StoreKey) {
        let SkipChar = ['.', '(', ')'];
        let IsClear = SkipChar.filter(Item => StoreKey.includes(Item)).length == 0;
        return IsClear;
    }
    _TryToJson(Data) {
        if (typeof Data === 'object')
            return Data;
        else if (typeof Data != 'string')
            return Data;
        else {
            try {
                return JSON.parse(Data);
            }
            catch {
                return Data;
            }
        }
    }
    _TryGetStoreKey(_StoreKey) {
        _StoreKey ??= this.DefaultStoreKey;
        return _StoreKey;
    }
    _GetClearDomain(_Domain) {
        let ClearDomain = _Domain.replace(/\/+$/, '');
        return ClearDomain;
    }
    _GetClearUrl(_Url) {
        let ClearUrl = _Url.replace(/^\/+/, '');
        return ClearUrl;
    }
    _GetRandomFuncName(FuncNameHead = '', FuncNameTail = '') {
        let RandomFuncName = this._GenerateId().replaceAll('-', '');
        if (!this._IsNullOrEmpty(FuncNameHead))
            RandomFuncName = `${FuncNameHead}_${RandomFuncName}`;

        if (!this._IsNullOrEmpty(FuncNameTail))
            RandomFuncName = `${RandomFuncName}_${FuncNameTail}`;

        return RandomFuncName;
    }
    //#endregion
}
const Model = new VueModel()
    .AddBase_Format_Date();