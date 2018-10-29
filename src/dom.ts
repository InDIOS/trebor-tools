import { _$List } from './list';
import { _$toString, _$isString, _$isType, _$isValueAttr, PROP_MAP, _$hasProp } from './utilities';

export function _$select(selector: string | Element, parent?: Element): HTMLElement {
	return _$isString(selector) ? (parent || document).querySelector(<string>selector) : <HTMLElement>selector;
}
export function _$docFragment() {
  return document.createDocumentFragment();
}
export function _$append(parent: Element, child: Element, sibling?: boolean | Element) {
  if (_$isType(sibling, 'boolean') && sibling) parent.parentElement.replaceChild(child, parent);
  else if (!sibling) parent.appendChild(child);
  else parent.insertBefore(child, <Element>sibling);
}
export function _$assignEl(source: Element, dest: Element) {
  const { childNodes, attributes } = source;
  for (let i = 0; i < childNodes.length; i++) {
    _$append(dest, <Element>childNodes[i]);
  }
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    dest.setAttributeNS(source.namespaceURI, attr.name, attr.value);
  }
  source.parentElement.replaceChild(dest, source);
  return dest;
}
export function _$removeEl(el: Element, parent: Element) {
  let root = parent || el.parentElement;
  if (root) root.removeChild(el);
}
export function _$el<T extends keyof HTMLElementTagNameMap>(tagName?: T) {
  return document.createElement(tagName || 'div');
}
export function _$svg<T extends keyof SVGElementTagNameMap>(tagName?: T) {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName || 'svg');
}
export function _$text(content?: string) {
  return document.createTextNode(content || '');
}
export function _$comment(content?: string) {
  return document.createComment(content || '');
}
export function _$setAttr(el: Element & { _value?: any }, attrAndValue: [string, any]) {
  let [attr, value] = attrAndValue;
  el.setAttribute(attr, _$toString(value));
  if (_$isValueAttr(attr) && !_$isString(value)) el[PROP_MAP._] = value;
}
export function _$getAttr(el: Element, attr: string) {
  return _$isValueAttr(attr) ? _$getValue(<HTMLInputElement>el) : el.getAttribute(attr);
}
export function _$getValue(el: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLOptionElement) & { _value?: any }) {
  return _$hasProp(el, PROP_MAP._) ? el[PROP_MAP._] : el[PROP_MAP.v];
}
export function _$addListener(el: HTMLElement, event: string, handler: EventListenerOrEventListenerObject) {
  el.addEventListener(event, handler, false);
}
export function _$updateListener(el: HTMLElement, event: string, oldHandler: EventListenerOrEventListenerObject, newHandler: EventListenerOrEventListenerObject) {
  _$removeListener(el, event, oldHandler);
  _$addListener(el, event, oldHandler = newHandler);
  return oldHandler;
}
export function _$removeListener(el: HTMLElement, event: string, handler: EventListenerOrEventListenerObject) {
  el.removeEventListener(event, handler, false);
}
export function _$bindGroup(input: HTMLInputElement, selection: string[]) {
  let _value = _$getValue(input);
  let _$index = selection.indexOf(_value);
  input.checked && !~_$index ? selection.push(_value) : selection.splice(_$index, 1);
}
export function _$bindMultiSelect(select: HTMLSelectElement, selections: any[]) {
  if (!selections.length) return;
  let { options } = select;
  for (let i = 0; i < options.length; i++) {
    options[i].selected = !!~selections.indexOf(_$getValue(options[i]));
  }
}
export function _$updateMultiSelect(select: HTMLSelectElement, obj: Component, prop: string) {
  let items = [];
  let selection = obj[prop];
  let { selectedOptions } = select;
  for (let i = 0; i < selectedOptions.length; i++) {
    items.push(_$getValue(selectedOptions[i]));
  }
  obj[prop] = new _$List(items, selection['_root'], selection['_key']);
  obj.$update();
}
export function _$insertStyle(id: string, css: string) {
  let isNew = false;
  let style = _$select(`#${id}`, document.head);
  if (!style) {
    isNew = true;
    style = _$el('style');
    style.id = id;
    _$setAttr(style, ['refs', 1]);
  }
  if (style.textContent !== css) {
    style.textContent = css;
  }
  if (isNew) {
    _$append(document.head, style);
  } else {
    let count = +_$getAttr(style, 'refs');
		_$setAttr(style, ['refs', ++count]);
  }
}
export function _$removeStyle(id: string) {
  let style = _$select(`#${id}`, document.head);
  if (style) {
    let count = +_$getAttr(style, 'refs');
    if (--count === 0) {
      _$removeEl(style, document.head);
    } else {
			_$setAttr(style, ['refs', count]);
    }
  }
}