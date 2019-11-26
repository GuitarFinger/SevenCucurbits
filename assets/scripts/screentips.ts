/**@module 弹出提示 */
// ========================================模块引入
import { Queue } from './queue';
import { Global } from './global';
import { EMsg, DTip } from './enum';

// ========================================常量定义

// ========================================导出接口


// ========================================数据结构

// ========================================变量声明

// ========================================类定义
export class ScreenTips {
    /**
     * 弹窗预制体
     */
    static screenTipPreFab: cc.Prefab = null;
    /**
     * 持续时间(单位: 秒)
     */
    static duration: number = 1;

    /**
     * 弹窗队列
     */
    static queue: Queue =  new Queue(100);
    /**
     * 节点池
     */
    static nodePool: cc.NodePool = new cc.NodePool();
    

    /**
     * 初始化弹出信息
     */
    static add = (tip: DTip) => {
        if (!ScreenTips.screenTipPreFab) return;

        ScreenTips.queue.push(() => {
            ScreenTips.create(tip)
        });
    }

    /**
     * 创建
     */
    static create = (tip: DTip) => {
        const node = ScreenTips.nodePool.size() ? ScreenTips.nodePool.get() : cc.instantiate(ScreenTips.screenTipPreFab);

        node.y = 0;
        node.getChildByName('text').getComponent(cc.Label).string = tip.text;
        node.parent = tip.parent;

        node.runAction(
            cc.sequence(
                cc.moveBy(ScreenTips.duration, cc.v2(0, 90)),
                cc.callFunc(ScreenTips.destory, null, node)
            )
        );

        tip.parent = null;
        tip.text = null;
        tip = null;
    }

    /**
     * 销毁
     */
    static destory = (target: any, node: cc.Node) => {
        ScreenTips.nodePool.put(node);
        node = null;
    }
}


// ========================================方法定义
const init = () => {
    Global.emitter.register({
        [EMsg.SCREEN_TIPS]: (tip: DTip) => {
            ScreenTips.add(tip);
        }
    });
};
// ========================================立即运行

init();