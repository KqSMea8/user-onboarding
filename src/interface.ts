export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface SceneStepBaseDef {
  zIndex?: number;
  width?: number | string;
  waitUntil?: {
    selector?: string;
    delay?: number;
  };

  /** 下一步的触发器 */
  nextStepTrigger?: string;
}

/** 步骤定义 */
export interface SceneStepDef {
  base: SceneStepBaseDef & {
    type: 'base';
  };

  /** 提醒类型的 step */
  notice: SceneStepBaseDef & {
    type: 'notice';
    topOffset?: number;
    leftOffset?: number;
    content: string;
  };

  /** 聚焦引导类型的 step */
  focus: SceneStepBaseDef & {
    type: 'focus';

    /** 定位锚点 */
    selector: string | string[];

    /** 浮层位置 */
    position?: 'top' | 'left' | 'right' | 'bottom' | 'bottomLeft';
    content: string;
  };

  /** 输入内容检查 step */
  inputChecker: Omit<SceneStepDef['focus'], 'type'> & {
    type: 'inputChecker';

    valueCollect: string;
    valueCollectField?: string;

    /** 校验规则 */
    rules: { pattern?: string; message?: string }[];
  };

  /** 走马灯 */
  carousel: SceneStepBaseDef & {
    type: 'carousel';
    topOffset?: number;
    leftOffset?: number;
    children: string[];
  };
}

export type SceneStepLike =
  | SceneStepDef['focus']
  | SceneStepDef['notice']
  | SceneStepDef['inputChecker']
  | SceneStepDef['carousel'];

export type SceneTheme = {
  brandColor?: string;
};

/** 场景定义 */
export interface SceneDef {
  steps: SceneStepLike[];
  theme?: SceneTheme;
}

/** 步骤控件接口 */
export type StepComponentProps = {
  [type in keyof SceneStepDef]: {
    data: SceneStepDef[type];
    stepIndex: number;
    stepTotal: number;

    onCancel: () => void;
    onNext: () => void;

    // 由 withStepProgress hoc 提供
    progressChild?: any;
  }
};

export interface ServiceInterface {
  getScene(name: string): Promise<SceneDef>;
}

/** 初始化配置 */
export type AppConfig = {
  service: ServiceInterface;
};

/** 订阅主题类型 */
export type TopicType = 'init' | 'nextStep' | 'finish';
export type TopicHandler = (topic: TopicType, data: any) => void;

/** 订阅发布中心 */
export interface PubCenterInterface {
  /** 订阅 */
  subscribe(topic: TopicType, handler: TopicHandler): PubCenterInterface;

  /** 发布 */
  publish(topic: TopicType, data?: any): PubCenterInterface;

  /** 取消订阅 */
  unSubscribe(topic: TopicType, handler: TopicHandler): PubCenterInterface;
}
