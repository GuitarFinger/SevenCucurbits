
/**
 * @class 发射器
 */
class Emitter {
    private _funcTable: Object = {};

    /**
     * 注册
     * @param obj 
     */
    public register(obj: Object) {
        for (let key in obj) {

            if (!this._funcTable[key]) {
                this._funcTable[key] = [];
            }

            this._funcTable[key].push(obj[key]);
        }
    }

    /**
     * 分发
     */
    public dispatch(key: string, data?: any) {
        const funcArr: Function[] = this._funcTable[key];

        if (!funcArr) return;

        funcArr.forEach(func => {
            func && func(data);
        });
    }

    /**
     * 移除
     * @param func 
     */
    public remove(key: string, func?: Function) {
        const funcArr: Function[] = this._funcTable[key];

        if (!funcArr || !funcArr.length) return;

        if (!func) {
            delete this._funcTable[key];
            return;
        }

        const funcIdx = funcArr.indexOf(func);

        if (funcIdx >= 0) {
            funcArr.splice(funcIdx, 1);
        }
    }
}

/**
 * 全局变量
 */
export const Global = {
    /**发射器 */
    emitter: new Emitter(),
    
};