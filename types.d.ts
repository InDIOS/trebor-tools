type AttrTypes = string | number | RegExp | null | boolean;
type AttrParams = string[] | ObjectLike<AttrDefinition>;
type DirectiveDefinition = (inst: Component, options: DirectiveOptions, node: HTMLElement) => void | DirectiveDefObject;
type TemplateFn = (component: Component) => ComponentTemplate;
type IterateKey<T> = T extends any[] ? number : string;
type IterateValue<T> = T extends any[] ? T[number] : T[keyof T];
type PluginFn = (this: Component, ctor: ComponentConstructor, pluginOptions?: ObjectLike<any>) => void;
interface ObjectLike<T> { [key: string]: T; }

interface DirectiveDefObject {
  $init?(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
  $inserted?(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
  $update(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
  $destroy?(inst: Component, options: DirectiveOptions, node: HTMLElement): void;
}

interface AttrDefinition {
  required?: boolean;
  type: string | Function;
  validator?(value: any): boolean;
  default?: AttrTypes | (() => AttrTypes | Object);
}

interface DirectiveOptions {
  value: any;
  expression: string;
  modifiers: ObjectLike<boolean>;
}

interface ComponentOptions extends ComponentHooks {
	model?: ObjectLike<any>;
  attrs?: string[] | ObjectLike<AttrDefinition>;
  filters?: ObjectLike<(...args: any[]) => any>;
  children?: ObjectLike<ComponentConstructor>;
  directives?: ObjectLike<DirectiveDefinition>;
}

interface ComponentTemplate {
  $create(): void;
  $mount(parent: string | Element, sibling?: string | boolean | Element): void;
  $update(state: Component, ...args: any[]): void;
  $unmount(): void;
  $destroy(): void;
}

interface ComponentHooks {
	willCreate?(this: Component): void;
	willMount?(this: Component): void;
	willUpdate?(this: Component): void;
	willUnmount?(this: Component): void;
	willDestroy?(this: Component): void;
	didCreate?(this: Component): void;
	didMount?(this: Component): void;
	didUpdate?(this: Component): void;
	didUnmount?(this: Component): void;
	didDestroy?(this: Component): void;
}

interface Component extends ComponentTemplate {
  $parent: Component;
  $parentEl: HTMLElement;
  $siblingEl: HTMLElement;
  readonly $refs: ObjectLike<HTMLElement[]>;
  readonly $slots: ObjectLike<DocumentFragment>;
  readonly $filters: ObjectLike<(...args: any[]) => any>;
  readonly $options: ComponentOptions;
  readonly $children: Component[];
  readonly $directives: ObjectLike<DirectiveDefinition>;
  $get<T>(path: string): T;
  $set<T>(path: string, value: T): void;
  $update(): void;
  $on(event: string, handler: (data?: any) => void): { $off(): void };
  $once(event: string, handler: (data?: any) => void): void;
  $fire(event: string, data?: any): void;
  $notify(key: string): void;
  $observe(key: string | string[], handler: () => void): { $unobserve(): void };
  $watch(key: string, handler: (oldValue?: any, newValue?: any) => void): { $unwatch(): void };
  [key: string]: any;
}

interface ComponentConstructor {
  new <T extends Component>(attrs?: string[] | ObjectLike<AttrDefinition>, parent?: Component): T;
  plugin(fn: PluginFn, options?: ObjectLike<any>): void;
  prototype: Component;
}