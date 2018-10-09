import { _$toArgs, _$List } from './list';
import { _$el, _$getAttr, _$setAttr, _$select, _$assignEl } from './dom';

function _$toLowerCase(str: string) {
  return str.toLowerCase();
}

export function devlog(type: 'info' | 'warn' | 'error', ...msgs: any[]) {
  console[type](...msgs);
}

export const PROP_MAP = { p: '__TP__', v: 'value', _: '_value', s: '_subscribers', e: '_events', w: '_watchers', h: 'prototype' };
export const TPS: { options: ObjectLike<any>, fn: PluginFn }[] = window[PROP_MAP.p] || (window[PROP_MAP.p] = []);

export const _$assign = Object['assign'] || function (t: Object) {
  for (let s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];
    for (const p in s) if (_$hasProp(s, p)) t[p] = s[p];
  }
  return t;
};
export function _$isValueAttr(attr: string) {
  return attr === 'value';
}
export function _$subscribers(dep: string, listener: Function) {
  if (!this[PROP_MAP.s][dep]) {
    this[PROP_MAP.s][dep] = [];
  }
  return this[PROP_MAP.s][dep].push(listener.bind(this)) - 1;
}
export function _$define(obj: Object, key: string, desc: PropertyDescriptor) {
  Object.defineProperty(obj, key, desc);
}
export function _$dispatch(root: Component, key: string, oldVal, value) {
  root.$notify(key);
  if (root[PROP_MAP.w][key]) {
    _$each(root[PROP_MAP.w][key], watcher => { watcher(oldVal, value); });
  }
  root.$update();
}
export function _$extend(ctor: Function, exts: Function) {
  ctor['plugin'] = function (fn: PluginFn, options?: ObjectLike<any>) {
    TPS.push({ options, fn });
  };
  ctor[PROP_MAP.h] = Object.create(exts[PROP_MAP.h]);
  ctor[PROP_MAP.h].constructor = ctor;
}
export function _$isType(value: any, type: string | Function) {
  return _$type(type) === 'string' ? (<string>type).split('\|').some(t => t.trim() === _$type(value)) : value instanceof <Function>type;
}
export function _$isObject(obj) {
  return _$isType(obj, 'object');
}
export function _$isArray(obj) {
  return Array.isArray ? Array.isArray(obj) : _$isType(obj, 'array');
}
export function _$isFunction(obj) {
  return _$isType(obj, 'function');
}
export function _$isString(obj) {
  return _$isType(obj, 'string');
}
export function _$toType(value, type, root: Component, key: string) {
  switch (type) {
    case 'date':
      return new Date(value);
    case 'string':
      return _$toString(value);
    case 'number':
      return +value;
    case 'boolean':
      return _$isString(value) && !value ? true : !!value;
    case 'array':
      return _$isType(value, _$List) ? value : new _$List(value, root, key);
    default:
      return value;
  }
}
function _$type(obj: any) {
  return _$toLowerCase(/ (\w+)/.exec({}.toString.call(obj))[1]);
}
export function _$hasProp(obj: Object, prop: string) {
  return obj.hasOwnProperty(prop);
}
export function _$directive(dd: DirectiveDefinition): DirectiveDefObject {
  const hasProp = (prop, instance, options, element) => _$isObject(dd) && dd[prop] && dd[prop](instance, options, element);
  return {
    $init(instance, options, element) {
      hasProp('$init', instance, options, element);
    },
    $inserted(instance, options, element) {
      hasProp('$inserted', instance, options, element);
    },
    $update(instance, options, element) {
      if (_$isFunction(dd)) {
        dd(instance, options, element);
      } else {
        hasProp('$update', instance, options, element);
      }
    },
    $destroy(instance, options, element) {
      hasProp('$destroy', instance, options, element);
    }
  };
}
export function _$noop() { }
export function _$addChild(inst: Component, Child: ComponentConstructor, attrs: string[] | ObjectLike<AttrDefinition>) {
  let child: Component = null;
  if (Child) {
    child = new Child(attrs, inst);
    inst.$children.push(child);
  }
  return child;
}
export function _$removeChild(inst: Component, child: Component) {
  let index = inst.$children.indexOf(child);
  index >= 0 && inst.$children.splice(index, 1);
}
export function _$toString(obj: any): string {
  const str: string = _$type(obj);
  return !/null|undefined/.test(str) ? obj.toString() : str;
}
export function _$toPlainObject(obj: Component) {
  const data: ObjectLike<any> = {};
  _$each(_$isObject(obj) ? obj : {}, (_v, k) => {
    if (k[0] !== '$' && !_$isFunction(obj[k])) {
      if (_$isType(obj[k], _$List)) {
        data[k] = obj[k].map(_$toPlainObject);
      } else if (_$isObject(obj[k])) {
        data[k] = _$toPlainObject(obj[k]);
      } else {
        data[k] = obj[k];
      }
    }
  });
  return _$isObject(obj) ? data : obj;
}
export function _$setReference(obj: Object, prop: string) {
  const value = [];
  _$define(obj, prop, {
    get: () => value.length <= 1 ? value[0] : value,
    set: val => { val && !~value.indexOf(val) && value.push(val); },
    enumerable: true, configurable: true
  });
}
export function _$accesor(object: Component, path: string, value?: any) {
  return path.split('.').reduce((obj, key, i, arr) => {
    if (_$isType(value, 'undefined')) {
      if (obj == null) {
        arr.splice(0, arr.length);
        return i > 0 && obj === null ? obj : undefined;
      }
    } else {
      if (i === arr.length - 1) {
        if (_$isType(obj, _$List) && _$toString(+key) === key) {
          obj.pull(+key, value);
        } else {
          let oldVal = obj[key];
          obj[key] = !_$isType(value, _$List) && _$isArray(value) ? new _$List(value, object, key) : value;
          _$dispatch(object, path, oldVal, obj[key]);
        }
      } else if (!_$isObject(obj[key])) {
        obj[key] = {};
      }
    }
    return obj ? obj[key] : null;
  }, object);
}
export function _$emptyElse() {
  return { type: 'empty-else', $create: _$noop, $mount: _$noop, $update: _$noop, $destroy: _$noop };
}
export function _$isKey(event: KeyboardEvent, key: string) {
  return _$toLowerCase(event.key) === key || !!event[`${key}Key`];
}
export function _$bindClasses(value: string | ObjectLike<boolean> | (string | ObjectLike<boolean>)[]) {
  let classes = '';
  if (_$isString(value)) {
    classes += ` ${value}`;
  } else if (_$isArray(value)) {
    classes = (<any[]>value).map(_$bindClasses).join(' ');
  } else if (_$isObject(value)) {
    for (let key in <Object>value)
      if (_$hasProp(value, key) && value[key]) classes += ` ${key}`;
  }
  return classes.trim();
}
export function _$bindStyle(value: string | ObjectLike<any>) {
  let el = _$el();
  if (_$isObject(value)) {
    const { style } = <HTMLElement>el;
    _$each(value, (val, prop) => {
      if (val !== style[prop]) style[prop] = val;
    });
    return style.cssText;
  } else if (_$isString(value)) {
    return value;
  } else {
    return '';
  }
}
export function _$conditionalUpdate(block: { type: string } & ComponentTemplate, condition: Function, inst: Component, parent: Element, anchor: Element) {
  if (block && block.type === condition(inst).type) {
    block.$update(inst);
  } else {
    block && block.$destroy();
    block = condition(inst);
    block.$create();
    block.$mount(parent, anchor);
  }
  return block;
}
export function _$bindUpdate(el: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) & { _value: any }, binding: [string, any]) {
  let [attr, value] = binding;
  let _value: string | boolean = attr === 'checked' ? !!value : _$toString(value);
  if (/value|checked/.test(attr)) {
    if (el[attr] !== _value) el[attr] = _$isValueAttr(attr) ? _value : value;
    el[PROP_MAP._] = _$isValueAttr(attr) ? value : el[PROP_MAP.v];
  } else if (_$getAttr(el, attr) !== _value) {
    _$setAttr(el, [attr, _value]);
  }
}
export function _$bindBooleanAttr(el: Element, attrAndValue: [string, any]) {
  let [attr, value, hasAttr] = attrAndValue.concat([el.hasAttribute(attrAndValue[0])]);
  value == null || value === false ? hasAttr && el.removeAttribute(attr) : _$setAttr(el, [attr, '']);
}
export function _$textUpdate(text: Text, value: string) {
  if (text.data !== (value = _$toString(value))) text.data = value;
}
export function _$tagUpdate<T extends keyof HTMLElementTagNameMap>(node: HTMLElement, tag: T) {
  return _$toLowerCase(tag) !== _$toLowerCase(node.tagName) ? _$assignEl(node, _$el(tag)) : node;
}
export function _$forLoop(root: Component, obj: any[], loop: (...args: any[]) => ComponentTemplate) {
  let items: ObjectLike<ComponentTemplate> = {}, loopParent: Element, loopSibling: Element;
  let globs = _$toArgs(arguments, 3);
  _$each(obj, (item, i) => { items[i] = loop.apply(null, [root, item, i].concat(globs)); });
  return {
    $create() {
      _$each(items, item => { item.$create(); });
    },
    $mount(parent, sibling) {
      loopParent = _$select(parent);
      loopSibling = _$select(sibling);
      _$each(items, item => { item.$mount(loopParent, loopSibling); });
    },
    $update(root: Component, obj: any[]) {
      let globs = _$toArgs(arguments, 2);
      _$each(items, (item, i) => {
        if (obj[i]) {
          item.$update.apply(item, [root, obj[i], i].concat(globs));
        } else {
          item.$destroy();
          delete items[i];
        }
      });
      _$each(obj, (item, i) => {
        if (!items[i]) {
          items[i] = loop.apply(null, [root, item, i].concat(globs));
          items[i].$create();
          items[i].$mount(loopParent, loopSibling);
        }
      });
    },
    $destroy() {
      _$each(items, item => { item.$destroy(); });
    }
  };
}
export function _$each<T>(obj: T, cb: (value: IterateValue<T>, key: IterateKey<T>) => void) {
  for (const key in obj) {
    if (_$hasProp(obj, key)) {
      cb(<any>obj[key], <any>(isNaN(+key) ? key : +key));
    }
  }
}