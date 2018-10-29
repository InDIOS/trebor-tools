export const PROPS = ['$slots', '$refs', '$filters', '$directives', '_events', '_watchers'];

export const PROP_MAP = { p: '__TP__', v: 'value', _: '_value', s: '_subscribers', e: '_events', w: '_watchers', h: 'prototype' };

export const TPS: { options: ObjectLike<any>, fn: PluginFn }[] = window[PROP_MAP.p] || (window[PROP_MAP.p] = []);
