/**
 *  VueModel.js v2.0.0
 *  From Rugal Tu
 *  Based on Vue3
 * */
const { createApp } = Vue
const Dom = new DomEditor();

class VueModel {

    constructor() {
        this.Store = {};
        this.ApiStore = {};
        this.VueOption = {};

        this.BindElementId = 'BindApp';
        this.DefaultStoreKey = 'Default';
        this.VueProxy = null;
        this.IsInited = false;
    }

    //#region Init
    Init() {
        if (!this.IsInited) {
            let GetStore = this.Store;
            let SetStore = {
                ...GetStore,
                Format_Date: (DateValue, StoreKey) => {
                    if (DateValue != undefined) {
                        let SetValue = DateValue.replaceAll('/', '-');
                        this.UpdateStore(SetValue, StoreKey);
                    }
                }
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
    AddV_Text(DomId, StoreKey = null, Format = null) {
        StoreKey = this._ReCombineStoreKey(StoreKey, DomId);
        this.AddVdom_Text(Dom.WithId(DomId), StoreKey, Format);
        return this;
    }
    AddVq_Text(QueryString, StoreKey = null, Format = null) {
        StoreKey = this._ReCombineStoreKey(StoreKey);
        this.AddVdom_Text(Dom.WithCustom(QueryString), StoreKey, Format);
        return this;
    }
    AddVdom_Text(_Dom, StoreKey, Format = null) {
        let Dom = this._BaseCheck_DomEditor(_Dom);
        if (Format != null)
            StoreKey = `$options.filters.${Format}(${StoreKey})`;
        Dom.SetAttr('v-text', StoreKey);
        return this;
    }

    AddV_Input(DomId, StoreKey = null) {
        StoreKey = this._ReCombineStoreKey(StoreKey, DomId);
        this.AddVdom_Input(Dom.WithId(DomId), StoreKey);
        return this;
    }
    AddVq_Input(QueryString, StoreKey = null) {
        StoreKey = this._ReCombineStoreKey(StoreKey);
        this.AddVdom_Input(Dom.WithCustom(QueryString), StoreKey);
        return this;
    }
    AddVdom_Input(_Dom, StoreKey) {
        let Dom = this._BaseCheck_DomEditor(_Dom);
        Dom.ForEach(Item => {
            let VModelCommand = 'v-model';
            switch (Item.type) {
                case 'date':
                    Dom.SetElement_Attr(Item, ':formatter', `Format_Date(${StoreKey}, '${StoreKey}')`);
                    break;
                case 'number':
                    VModelCommand = 'v-model.number';
                    break;
            }
            Dom.SetElement_Attr(Item, VModelCommand, StoreKey);
        });
        return this;
    }



    _ReCombineStoreKey(Param1, Param2 = null) {
        if (Param1 == null)
            throw new Error('Param1 is null');

        let ParamArray = [Param1, Param2].filter(Item => Item != null);
        let BindStoreKey = ParamArray.join('.');
        if (!BindStoreKey.includes('.'))
            BindStoreKey = `${this.DefaultStoreKey}.${BindStoreKey}`;

        return BindStoreKey;
    }
    //#endregion

    //#region Base Add Vue Command
    _BaseCheck_DomEditor(Dom) {
        if (Dom instanceof DomEditor)
            return Dom;
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
        if (this.Store[StoreKey] != null)
            return this;

        this.Store[StoreKey] = StoreData;
        this._UpdateVueStore();
        return this;
    }

    _RCS_GetStore(StoreKey, FindStore) {
        if (!StoreKey.includes('.'))
            return this.Store[StoreKey];

        let FirstKey = StoreKey.split('.')[0];
        let NextKey = StoreKey.replaceAll(`${FirstKey}.`);
        return this._RCS_GetStore(NextKey, FindStore[FirstKey]);
    }
    _RCS_SetStore(StoreKey, StoreData, FindStore, IsReplace) {
        if (!StoreKey.includes('.')) {
            if (!(StoreKey in FindStore) || IsReplace) {
                this._BaseSetStoreObject(FindStore[StoreKey], StoreData);
            }
            else {
                let GetStore = FindStore[StoreKey];
                let SetStore = StoreData;

                if (typeof GetStore != 'object')
                    FindStore[StoreKey] = SetStore;
                else {
                    this._BaseSetStoreObject(FindStore[StoreKey], StoreData);
                }
            }
            return FindStore[StoreKey];
        }
        else {
            let FirstKey = StoreKey.split('.')[0];
            let NextKey = StoreKey.replaceAll(`${FirstKey}.`, '');
            return this._RCS_SetStore(NextKey, StoreData, FindStore[FirstKey], IsReplace);
        }
    }
    _BaseSetStoreObject(Target, Source) {
        let AllKeys = Object.keys(Source);
        for (let i = 0; i < AllKeys.length; i++) {
            let Key = AllKeys[i];
            Target[Key] = Source[Key];
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
    _ForEachKeyValue(Param, Func = (Key, Value) => { }) {
        let AllKey = Object.keys(Param);
        for (let i = 0; i < AllKey.length; i++) {
            let Key = AllKey[i];
            let Value = Param[Key];
            Func?.call(this, Key, Value);
        }
    }
    _IsString(Data) { return typeof Data === 'string'; }
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
const Model = new VueModel();