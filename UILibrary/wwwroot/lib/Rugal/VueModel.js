/**
 *  VueModel.js v2.0.1
 *  From Rugal Tu
 *  Based on Vue3, CommonFunc.js, DomEditor.js
 * */
const { createApp } = Vue
const Dom = new DomEditor();

class VueModel extends CommonFunc {

    constructor() {
        super();
        this.Store = {};
        this.ApiStore = {};
        this.VueOption = {
            methods: {},
        };

        this.BindElementId = 'BindApp';
        this.DefaultStoreKey = 'Default';
        this.WithDefaultStore(this.DefaultStoreKey);
        this.VueProxy = null;
        this.IsInited = false;

        this.AcceptAutoBindType_Input = ['input', 'textarea'];
        this.AcceptAutoBindType_Text = ['div', 'label', 'span'];
        this.FuncKey_FormatDate = 'Format_Date';
    }

    //#region Property
    get Dom() {
        return new DomEditor();
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
    WithSotreData(_StoreData) {
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
    AddVdom_Text(Dom, ...StoreKey) {
        StoreKey = this._ReCombineStoreKey(StoreKey);
        this.AddStore(StoreKey, null);
        let GetDom = this._BaseCheck_DomEditor(Dom);
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
        StoreKey = this._ReCombineStoreKey(StoreKey);
        let GetDom = this._BaseCheck_DomEditor(Dom);

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

        this.AddVdom_Select({
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
        let SelectDom = this.Dom
            .WithCustom(Option.SelectQuery)
            .ForEach(Item => {
                if (Option.From.toLowerCase() != '-html') {
                    let Display = this._ReCombineItemKey(Option.Display);
                    let Value = this._ReCombineItemKey(Option.Value);

                    let OptionDom = new DomEditor(Item.children)
                        .WhereCustom(Option.OptionQuery)
                        .SetAttr('v-text', Display)
                        .SetAttr(':value', Value)
                        .SetAttr('v-for', `(Item, Idx) in ${Option.From}`);
                }
                let StoreKey = this._ReCombineStoreKey(Option.To);
                new DomEditor(Item).SetAttr('v-model', StoreKey);
            })
        return this;
    }
    //#endregion

    //#region
    AddV_For(DomId, StoreKey) {
        this.AddVdom_For(this.Dom.WithId(DomId), StoreKey ?? DomId);
        return this;
    }
    AddVq_For(QueryString, StoreKey) {
        this.AddVdom_For(this.Dom.WithCustom(QueryString), StoreKey);
        return this;
    }
    AddVdom_For(Dom, StoreKey) {
        this.AddStore(StoreKey, []);
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-for', `(Item, Idx) in ${StoreKey}`);
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
            if (!this.AcceptAutoBindType_Text.includes(TagName))
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
            let TagName = Item.tagName.toLowerCase();
            if (!this.AcceptAutoBindType_Input.includes(TagName))
                return;

            let SetStoreKey = this._Analyze_AutoBind_From(Item, BindFrom);
            if (this._IsClearSotreKey(SetStoreKey))
                SetStoreKey = `${StoreKey}.${SetStoreKey}`;
            this.AddVdom_Input(GetDom.NewWithElement(Item), SetStoreKey);
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
            FindStore[StoreKey] = SetData;
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

    ApiCall(_ApiKey, _Param = null, _OnSuccess = null, _OnComplete = null, _OnError = null) {
        let Api = this.ApiStore[_ApiKey];
        let Url = Api.Url;
        _Param ??= {};
        let FetchParam = {
            method: Api.Method,
        };
        if (Api.Method == 'GET') {
            let UrlParam = this._ConvertToUrlParam(_Param);
            Url += `?${UrlParam}`;
        }
        else {
            FetchParam['body'] = JSON.stringify(_Param);
            FetchParam['headers'] = {
                'content-type': 'application/json'
            };
        }

        fetch(Url, FetchParam)
            .then(async ApiRet => {
                if (!ApiRet.ok)
                    throw ApiRet;

                let ConvertRet = await this._ProcessApiReturn(Api, ApiRet);
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
    _ProcessApiReturn(Api, ApiRet) {
        let TryGetRet = null;
        let GetContentType = ApiRet.headers.get("content-type");
        let ConvertSuccess = null;
        if (GetContentType && GetContentType.includes('application/json')) {
            ConvertSuccess = ApiRet.json()
                .then((GetJson) => TryGetRet = GetJson);
        }
        else {
            ConvertSuccess = ApiRet.text()
                .then((GetText) => TryGetRet = GetText);
        }
        return ConvertSuccess
            .then(() => {
                let StoreKey = Api.ApiKey;
                this.UpdateStore(TryGetRet, StoreKey, true);
                return TryGetRet;
            });
    }
    _ConvertToUrlParam(Param) {
        let AllParam = [];
        this._ForEachKeyValue(Param, (Key, Value) => {
            AllParam.push(`${Key}=${Value}`);
        });

        let ParamString = AllParam.join('&');
        return ParamString;
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
    //#endregion
}
const Model = new VueModel()
    .AddBase_Format_Date();