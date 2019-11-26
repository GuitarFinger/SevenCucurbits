import { Global } from "./global";
import { ScreenTips } from "./screentips";
import { EMsg, DTip } from "./enum";
import { CicleLinkedList, LinkNode } from "./doublyLinkedList";

// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;
/**可输入值 */
const INPUT_NUMS: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
/**小值 */
const MIN_NUMS: string[] = ['1', '2', '3', '4', '5' ];
/**大值 */
const MAX_NUMS: string[] = ['6', '7', '8', '9', '10'];
const SPECIAL_NUMS: string[] = ['7', '8', '9', '10'];
/**固定值 */
const FIX_VALS: string[] = ['10', '30', '70', '150', '320', '650'];
/**
 * 最小基础
 */
const MIN_BASE = 1;
/**
 * 基础最大
 */
const MAX_BASE = 10;
/**
 * 最大长度
 */
const MAX_LEN = 7;


// ============================ 变量定义
/**
 * 固定值双向链表
 */
let fixValDLL:CicleLinkedList = new CicleLinkedList();

// ============================ 类定义
@ccclass
export default class Main extends cc.Component {
    @property({ type: cc.Prefab, displayName: '弹出提示' })
    screenTipPreFab: cc.Prefab = null;

    @property({ type: cc.Node, displayName: '输入盒' })
    boxInputs: cc.Node = null;

    @property({ type: cc.Node, displayName: '倍数盒' })
    boxMultiple: cc.Node = null;

    @property({ type: cc.Node, displayName: '中间盒' })
    boxCenter: cc.Node = null;

    @property({ type: cc.Node, displayName: '结果盒' })
    boxResult: cc.Node = null;
    
    /**
     * 输入列表
     */
    inputList: Object = {};
    /**
     * 倍数
     */
    multiple: any = 1;
    /**
     * 中间矩阵
     */
    centerMatrix: [][] = [];
    /**
     * 当前固定值链表节点
    */
    fixLinkNodes: Object = {};
    LinkNode = null;
    /**
     * 结果值
     */
    resultArr: number[] = [];
    /**
     * 七个输入值
     */
    sevenInput: object = {};

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ScreenTips.screenTipPreFab = this.screenTipPreFab;
        this.init();
    }

    start () {

    }

    // update (dt) {}
    init () {
        for (let i = 1; i <= 7; i++) {
            this.sevenInput[i] = [];
            
        }

        for (let j = 0; j < 10; j++) {
            this.fixLinkNodes[j] = fixValDLL.head;
        }
    }

    
    /**
     * 基本数字改变
     */
    onBaseTextInputChanged (text: string, editbox: cc.EditBox, inputIdx: string) {
        this.inputList[inputIdx] = text;
    }

    /**
     * 基本数字输入结束
     */
    onBaseTextEditEnded (editbox: cc.EditBox, inputIdx: any) {
        this.judgeBaseInput();
    }

    /**
     * 倍率输入改变
     */
    onMultiInputChange (text: string, editBox: cc.EditBox) {
        this.multiple = text === '' ? 1 : text;
    }
    /**
     * 倍率输入结束
     */
    onMultiEditEnded (editbox: cc.EditBox) {
        this.judgeMultiple();
    }

    /**
     * 判断基本输入
     */
    judgeBaseInput = () => {
        if (!Utils.isFixValue(this.inputList, INPUT_NUMS) || !Utils.isRepeat(this.inputList)) {
            Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip(this.node, '输入的值必须为1-10, 且不能重复'));
            return false;
        }

        return true;
    }

    /**
     * 判断倍数
     */
    judgeMultiple = () => {
        if (!Utils.isPositiveInteger(this.multiple)) {
            Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip(this.node, '输入的倍数必须为正整数'));
            return false;
        }

        return true;
    }

    /**
     * 计算结果
     */
    onCalcResult () {
        const len = Object.keys(this.inputList).length;
        if (len != INPUT_NUMS.length) {
            Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip(this.node, `还有${INPUT_NUMS.length - len}个值没填, 请将输入值填完`));
            return;
        }

        if (!this.judgeBaseInput() || !this.judgeMultiple()) return;

        this.calcCenterMatrix();
        this.generateCenterMatrixNodes();
        this.calcResultArr();
        this.generateResultNodes();
    }

    getInputValArr () {
        const tempArr = [];
        
        for (let i = 1; i <= 10; i++) {
            tempArr.push(this.inputList[i]);
        }

        return tempArr;
    }

    /**
     * 生成结果矩阵
     */
    calcCenterMatrix () {
        for (let i = 1; i <= 7; i++) {
            if (i === 7) {
                this.sevenInput[i] = this.getInputValArr();
            } else {
                this.sevenInput[i] = [...this.sevenInput[i+1]];
            }
        }
    }

    /**
     * 生成矩阵节点
     */
    generateCenterMatrixNodes () {
        for (let i = 0; i < 10; i++) {
            const boxNode = this.boxCenter.getChildByName(`box_${Utils.fillPreZero(i+1, 2)}`);
            for (let j = 7; j >= 1; j--) {
                const itemNode = boxNode.getChildByName(`item_center${Utils.fillPreZero(j, 2)}`);
                itemNode.getChildByName('text').getComponent(cc.Label).string = `${this.sevenInput[j].length ? this.sevenInput[j][i] : ''}`;
            }
        }
    }

    /**
     * 计算结果数组
     */
    calcResultArr () {
        const seventh = this.sevenInput[7];
        const sixth = this.sevenInput[6];

        // this.fixLinkNode = fixValDLL.head;

        this.resultArr = [];

        for (let i = 0; i < seventh.length; i++) {
            if (!sixth.length) {
                this.resultArr.push(Number(fixValDLL.head.element) * Number(this.multiple || 1));
                this.fixLinkNodes[i] = fixValDLL.head.next;
            } else {
                const firstType = MIN_NUMS.indexOf(seventh[i]) >= 0 ? 'min' :
                                                               MAX_NUMS.indexOf(seventh[i]) >= 0 ? 'max' :
                                                                                                    seventh[i];
                const secondType = MIN_NUMS.indexOf(sixth[i]) >= 0 ? 'min' :
                                                                MAX_NUMS.indexOf(sixth[i]) >= 0 ? 'max' :
                                                                                                   sixth[i];

                if (!firstType || !secondType || firstType !== secondType) {
                    this.resultArr.push(Number(this.fixLinkNodes[i].element) * Number(this.multiple || 1));
                    this.fixLinkNodes[i] = this.fixLinkNodes[i].next;
                }
                else if (firstType === secondType) {
                    this.resultArr.push(Number(fixValDLL.head.element) * Number(this.multiple || 1));
                    this.fixLinkNodes[i] = fixValDLL.head.next;
                }
            }
        }
    }

    /**
     * 生成结果节点
     */
    generateResultNodes () {
        for (let i = 0; i < this.resultArr.length; i++) {
            const itemNode = this.boxResult.getChildByName(`item_result${Utils.fillPreZero(i+1, 2)}`);

            itemNode.getChildByName('text').getComponent(cc.Label).string = `${this.resultArr[i]}`;
        }
    }

    /**
     * 重置中心文字节点
     */
    resetCenterNodes () {
        for (let i = 0; i < 10; i++) {
            const boxNode = this.boxCenter.getChildByName(`box_${Utils.fillPreZero(i+1, 2)}`);

            for (let j = 0; j < 7; j++) {
                const itemNode = boxNode.getChildByName(`item_center${Utils.fillPreZero(j+1, 2)}`);
                itemNode.getChildByName('text').getComponent(cc.Label).string = ``;
            }
        }

    }

    /**
     * 重置结果文字节点
     */
    resetResultNodes () {
        for (let i = 0; i < 10; i++) {
            const itemNode = this.boxResult.getChildByName(`item_result${Utils.fillPreZero(i+1, 2)}`);
            itemNode.getChildByName('text').getComponent(cc.Label).string = ``;
        }
    }

    /**
     * 重置倍数
     */
    resetInitMutiple (flag?: string) {
        const inputNode = this.boxMultiple.getChildByName('input');
        inputNode.getComponent(cc.EditBox).string = '';

        this.multiple = 1;
    }

    /**
     * 重置输入
     */
    resetBoxInput (flag?: string) {
        for (let i = 0; i < 10; i++) {
            const inputNode = this.boxInputs.getChildByName(`input_${Utils.fillPreZero(i+1, 2)}`);
            inputNode.getComponent(cc.EditBox).string = '';
        }

        this.inputList = {};
    }

    /**
     * 重置所有
     */
    resetAll () {
        this.resetCenterNodes();
        this.resetResultNodes();
        this.resetInitMutiple();
        this.resetBoxInput();
        this.init();
        this.inputList = {};
    }

}


class Utils {
    /**
     * 判断是否是固定值
     */
    static isFixValue = (obj: Object, fixArr: string[]) => {
        for (let k in obj) {
            const tempVal = obj[k];
            if (fixArr.indexOf(tempVal) < 0) return false;
        }

        return true;
    }

    /**
     * 判断重复
     */
    static isRepeat = (obj: Object): boolean => {
        const tempObj = {};

        for (let k in obj) {
            const val = obj[k];
            if (!tempObj[val]) {
                tempObj[val] = true;
            } else {
                return false;
            }
        }

        return true;
    }

    /**
     * 判断正整数
     */
    static isPositiveInteger = (val: any): boolean => {
        return Number(val) > 0;
    }

    /**
     * 前置位补齐
     */
    static fillPreZero = (num: number | string, digit: number) => {
        num = Number(num);
        let tempNum = `${num}`;

        if (digit < 2 || num >= Math.pow(10, digit-1)) return tempNum;

        for (let i = Math.floor(num/10); i < digit-1; i++) {
            tempNum = `0${tempNum}`;
        }

        return tempNum;
    }
}

// ============================ 组件定义


// ============================ 方法定义
/**
 * 初始化固定值双向链表
 */
const initFixValDLL = () => {
    FIX_VALS.forEach(val => {
        fixValDLL.append(val);
    });
    console.log(fixValDLL);
}

// ============================ 导出


// ============================ 立即执行
initFixValDLL();
