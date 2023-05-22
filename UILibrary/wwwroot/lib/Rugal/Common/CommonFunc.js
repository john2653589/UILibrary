/**
 *  CommonFunc.js v1.0.3
 *  From Rugal Tu
 *  Update 2023/05/22
 * */
class CommonFunc {

    constructor() {
        this.Id = this._GenerateId();
    }

    _HasAnyKeys(Obj) {
        let AllKey = Object.keys(Obj);
        let IsHas = AllKey.length > 0;
        return IsHas;
    }

    _ForEachKeyValue(Param, Func = (Key, Value) => { }) {
        let AllKey = Object.keys(Param);
        for (let i = 0; i < AllKey.length; i++) {
            let Key = AllKey[i];
            let Value = Param[Key];
            Func?.call(this, Key, Value);
        }
    }
    _IsNullOrEmpty(Text) {
        if (Text == null || Text == '')
            return true;
        return false;
    }
    _Throw(Message) {
        throw new Error(Message);
    }
    _GenerateId() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    _IsString(Data) { return typeof Data === 'string'; }
}

var DefaultData;
function Init(_DefaultData) {
    DefaultData = JSON.parse(_DefaultData);
};