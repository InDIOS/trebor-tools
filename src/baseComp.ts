import { _$List } from './list';
import { _$getValue } from './dom';
import { PROPS, PROP_MAP, TPS } from './constants';
import { _$each, _$define, _$assign, _$isType, _$isString, _$isFunction, _$hasProp, _$toType, _$directive, _$isArray, _$toPlainObject, _$accesor, _$subscribers, _$isValueAttr, _$toString, _$extends } from './utilities';

function _$BaseComponent(attrs: AttrParams, template: TemplateFn, options: ComponentOptions, parent: Component) {
  const self = this;
  const _$set = (prop: string, value: any) => { _$define(self, prop, { value, writable: true }); };
  if (!attrs) attrs = {};
  _$each(PROPS, prop => { _$define(self, prop, { value: {} }); });
  _$set('$parent', parent || null);
  _$set('$children', []);
  _$set(PROP_MAP.s, {});
  _$set('$options', options);
  const opts: ComponentOptions = self.$options;
  if (!opts.attrs) opts.attrs = {};
  if (!opts.children) opts.children = {};
  _$each(TPS, (plugin) => { plugin.fn.call(self, _$BaseComponent, plugin.options); });
  if (opts.filters) _$assign(self.$filters, opts.filters);
  if (opts.directives) _$each(opts.directives, (drt, k) => { self.$directives[k] = _$directive(drt); });
  _$each(opts.attrs, (attrOps, key) => {
    _$define(self, <string>(_$isType(key, 'number') ? attrOps : key), {
      get() {
        if (_$isString(attrOps)) {
          let value = attrs[<string>attrOps];
          return _$isFunction(value) ? value() : value;
        } else {
          if (!_$hasProp(attrs, <string>key) && (<AttrDefinition>attrOps).required) {
            return console.error(`Attribute '${key}' is required.`);
          } else {
            let value = _$isFunction(attrs[key]) ? attrs[key]() : attrs[key];
            if (value === void 0 && _$hasProp(attrOps, 'default')) {
              const def = (<AttrDefinition>attrOps).default;
              value = _$isFunction(def) ? (<Function>def)() : def;
            }
            const typ = (<AttrDefinition>attrOps).type;
            if (typ && !_$isType(value, typ) && (<AttrDefinition>attrOps).required) {
              return console.error(`Attribute '${key}' must be type '${typ}'.`);
            }
            value = _$toType(value, value === void 0 ? 'undefined' : typ, self, <string>key);
            if (value !== void 0 && _$hasProp(attrOps, 'validator')) {
              const validator = (<AttrDefinition>attrOps).validator;
              if (_$isFunction(validator) && !validator(value)) {
                return console.error(`Assigment '${key}'='${JSON.stringify(value)}' invalid.`);
              }
            }
            return value;
          }
        }
      },
      set() {
        console.error(`'${key}' is read only.`);
      },
      enumerable: true, configurable: true
    });
  });
  let data = opts.model || {};
  for (const key in data) {
    if (_$hasProp(data, key)) {
      const desc = Object.getOwnPropertyDescriptor(data, key);
      if (desc.value && _$isArray(desc.value)) {
        desc.value = new _$List(desc.value, self, key);
      } else {
        if (desc.get) {
          let getter = desc.get;
          desc.get = function () {
            let value = getter.call(self);
            if (_$isArray(value)) value = new _$List(value, self, key);
            return value;
          };
        }
        if (desc.set) {
          let setter = desc.set;
          desc.set = function (v: any) {
            if (_$isArray(v)) v = new _$List(v, self, key);
            setter.call(self, v);
          };
        }
      }
      _$define(self, key, desc);
    }
  }
  const tpl = template(self);
  _$each(tpl, (value, key) => {
    _$define(self, key, {
      value: (function (key) {
        const hook = key[1].toUpperCase() + key.slice(2);
        const bhook = opts[`will${hook}`];
        const ahook = opts[`did${hook}`];
        return function () {
          bhook && bhook.call(this);
          key === '$update' ? value.call(this, this) : value.apply(this, arguments);
          ahook && ahook.call(this);
        };
      })(key)
    });
  });
  _$define(self, '$data', {
    get() {
      return _$toPlainObject(this);
    }
  });
}
_$assign(_$BaseComponent[PROP_MAP.h], {
  $get(path: string) {
    return _$accesor(this, path);
  },
  $set(path: string, value: any) {
    _$accesor(this, path, value);
  },
  $on(event: string, handler: Function) {
    if (!this[PROP_MAP.e][event]) {
      this[PROP_MAP.e][event] = [];
    }
    const i = this[PROP_MAP.e][event].push(handler);
    return {
      $off: () => {
        this[PROP_MAP.e][event].splice(i - 1, 1);
      }
    };
  },
  $once(event: string, handler: Function) {
    const e = this.$on(event, args => {
      handler(args);
      e.$off();
    });
  },
  $fire(event: string, data: any) {
    if (this[PROP_MAP.e][event]) {
      _$each(this[PROP_MAP.e][event], handler => { handler(data); });
    }
  },
  $notify(key: string) {
    if (this[PROP_MAP.s][key]) {
      _$each(this[PROP_MAP.s][key], suscriber => { suscriber(); });
    }
  },
  $observe(deps: string | string[], listener: Function) {
    const subs: { sub: string, i: number }[] = [];
    if (_$isArray(deps)) {
      _$each(<string[]>deps, dep => {
        subs.push({ sub: dep, i: _$subscribers.call(this, dep, listener) });
      });
    } else {
      subs.push({ sub: <string>deps, i: _$subscribers.call(this, deps, listener) });
    }
    return {
      $unobserve: () => {
        _$each(subs, sub => {
          this[PROP_MAP.s][sub.sub].splice(sub.i, 1);
        });
      }
    };
  },
  $watch(key: string, watcher: Function) {
    if (!this[PROP_MAP.w][key]) {
      this[PROP_MAP.w][key] = [];
    }
    const i = this[PROP_MAP.w][key].push(watcher.bind(this));
    return {
      $unwatch: () => {
        this[PROP_MAP.w][key].splice(i - 1, 1);
      }
    };
  }
});

export function _$Ctor(moduleName: string, tpl: Function, options: Object) {
	const ctor: ComponentConstructor = <any>{
		[moduleName](_$attrs, _$parent) {
			_$BaseComponent.call(this, _$attrs, tpl, options, _$parent);
			!_$parent && this.$create();
		}
	}[moduleName];
	ctor.plugin = (fn: PluginFn, options?: ObjectLike<any>) => {
		TPS.push({ options, fn });
	};
	_$extends(ctor, _$BaseComponent);
	return ctor;
}