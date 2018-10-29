import { PROP_MAP } from './constants';
import { _$isType, _$isArray, _$define, _$assign, _$extends, _$dispatch } from './utilities';

const array = Array[PROP_MAP.h];
export function _$toArgs(args: IArguments, start: number = 0): any[] {
  return array.slice.call(args, start);
}
function _$arrayValues(list, value: any[], root: Component, key: string) {
  array.push.apply(list, value.map((v, i) => {
    if (list.length !== 0) i += list.length;
    return !(_$isType(v, _$List)) && _$isArray(v) ? new _$List(v, root, `${key}.${i}`) : v;
  }));
}
export function _$List(value: any[], root: Component, key: string) {
  let self = this;
  Array.apply(self, [value.length]);
  let desc = { writable: false, configurable: false, enumerable: false };
  _$define(self, '_key', _$assign({ value: key }, desc));
  _$define(self, '_root', _$assign({ value: root }, desc));
  _$arrayValues(self, value, root, key);
  desc.writable = true;
  _$define(self, 'length', _$assign({ value: self.length }, desc));
}
_$extends(_$List, Array);
['pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice'].forEach(method => {
  _$List[PROP_MAP.h][method] = function () {
    let self = this;
    const old = self.slice();
    let result;
    if (method === 'push') {
      _$arrayValues(self, _$toArgs(arguments), self._root, self._key);
      result = self.length;
    } else {
      result = array[method].apply(self, arguments);
    }
    _$dispatch(self._root, self._key, old, self.slice());
    return result;
  };
});
_$List[PROP_MAP.h].pull = function (index: number) {
  let self = this;
  let items = _$toArgs(arguments, 1);
  let length = self.length;
  if (index > length) {
    length = index + 1;
    const pull = new Array(index - self.length);
    pull.push.apply(pull, items);
    for (let i = 0; i < length; i++) {
      if (i === index) {
        self.push.apply(self, pull);
      }
    }
  } else {
    self.splice.apply(self, [index, 1].concat(items));
  }
};