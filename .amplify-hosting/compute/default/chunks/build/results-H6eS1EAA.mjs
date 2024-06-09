import { b as button, _ as __nuxt_component_3 } from './Button-C9mGLMtE.mjs';
import { _ as __nuxt_component_2 } from './Icon-BTndY_Cj.mjs';
import { I, u, o as o$1, t, i, A, s as s$1, l, N as N$1, a as l$1, b as o, c as useId } from './keyboard-CNNi71PZ.mjs';
import { defineComponent, ref, provide, computed, onMounted, onUnmounted, watchEffect, toRef, watch, useSSRContext, withAsyncContext, withCtx, unref, createVNode, openBlock, createBlock, Fragment, renderList, createTextVNode, toDisplayString, inject, resolveComponent, mergeProps, renderSlot, withKeys, Transition, withDirectives, vShow } from 'vue';
import { u as useUI, o as omit } from './selectMenu-CW6COth7.mjs';
import { m as mergeConfig, c as appConfig, b as useRoute, _ as _export_sfc } from './server.mjs';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttrs, ssrRenderSlot, ssrRenderStyle } from 'vue/server-renderer';
import { _ as __nuxt_component_0$1 } from './Textarea-CZLiAeIV.mjs';
import { u as useFetch } from './fetch-CTjB-max.mjs';
import './nuxt-link-DPBnjplD.mjs';
import '../../index.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'tailwind-merge';
import './Icon-COXSlKhV.mjs';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import './index-Cj2Bc71W.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';

const accordion = {
  wrapper: "w-full flex flex-col",
  container: "w-full flex flex-col",
  item: {
    base: "",
    size: "text-sm",
    color: "text-gray-500 dark:text-gray-400",
    padding: "pt-1.5 pb-3",
    icon: "ms-auto transform transition-transform duration-200"
  },
  transition: {
    enterActiveClass: "overflow-hidden transition-[height] duration-200 ease-out",
    leaveActiveClass: "overflow-hidden transition-[height] duration-200 ease-out"
  },
  default: {
    openIcon: "i-heroicons-chevron-down-20-solid",
    closeIcon: "",
    class: "mb-1.5 w-full",
    variant: "soft"
  }
};
var $ = ((o2) => (o2[o2.Open = 0] = "Open", o2[o2.Closed = 1] = "Closed", o2))($ || {});
let T = Symbol("DisclosureContext");
function O(t2) {
  let r = inject(T, null);
  if (r === null) {
    let o2 = new Error(`<${t2} /> is missing a parent <Disclosure /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(o2, O), o2;
  }
  return r;
}
let k = Symbol("DisclosurePanelContext");
function U() {
  return inject(k, null);
}
let N = defineComponent({ name: "Disclosure", props: { as: { type: [Object, String], default: "template" }, defaultOpen: { type: [Boolean], default: false } }, setup(t$1, { slots: r, attrs: o$12 }) {
  let s2 = ref(t$1.defaultOpen ? 0 : 1), e = ref(null), i$1 = ref(null), n = { buttonId: ref(`headlessui-disclosure-button-${I()}`), panelId: ref(`headlessui-disclosure-panel-${I()}`), disclosureState: s2, panel: e, button: i$1, toggleDisclosure() {
    s2.value = u(s2.value, { [0]: 1, [1]: 0 });
  }, closeDisclosure() {
    s2.value !== 1 && (s2.value = 1);
  }, close(l2) {
    n.closeDisclosure();
    let a = (() => l2 ? l2 instanceof HTMLElement ? l2 : l2.value instanceof HTMLElement ? o$1(l2) : o$1(n.button) : o$1(n.button))();
    a == null || a.focus();
  } };
  return provide(T, n), t(computed(() => u(s2.value, { [0]: i.Open, [1]: i.Closed }))), () => {
    let { defaultOpen: l2, ...a } = t$1, c = { open: s2.value === 0, close: n.close };
    return A({ theirProps: a, ourProps: {}, slot: c, slots: r, attrs: o$12, name: "Disclosure" });
  };
} }), Q = defineComponent({ name: "DisclosureButton", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false }, id: { type: String, default: null } }, setup(t2, { attrs: r, slots: o$2, expose: s$1$1 }) {
  let e = O("DisclosureButton"), i2 = U(), n = computed(() => i2 === null ? false : i2.value === e.panelId.value);
  onMounted(() => {
    n.value || t2.id !== null && (e.buttonId.value = t2.id);
  }), onUnmounted(() => {
    n.value || (e.buttonId.value = null);
  });
  let l2 = ref(null);
  s$1$1({ el: l2, $el: l2 }), n.value || watchEffect(() => {
    e.button.value = l2.value;
  });
  let a = s$1(computed(() => ({ as: t2.as, type: r.type })), l2);
  function c() {
    var u2;
    t2.disabled || (n.value ? (e.toggleDisclosure(), (u2 = o$1(e.button)) == null || u2.focus()) : e.toggleDisclosure());
  }
  function D(u2) {
    var S;
    if (!t2.disabled)
      if (n.value)
        switch (u2.key) {
          case o.Space:
          case o.Enter:
            u2.preventDefault(), u2.stopPropagation(), e.toggleDisclosure(), (S = o$1(e.button)) == null || S.focus();
            break;
        }
      else
        switch (u2.key) {
          case o.Space:
          case o.Enter:
            u2.preventDefault(), u2.stopPropagation(), e.toggleDisclosure();
            break;
        }
  }
  function v(u2) {
    switch (u2.key) {
      case o.Space:
        u2.preventDefault();
        break;
    }
  }
  return () => {
    var C;
    let u2 = { open: e.disclosureState.value === 0 }, { id: S, ...K } = t2, M = n.value ? { ref: l2, type: a.value, onClick: c, onKeydown: D } : { id: (C = e.buttonId.value) != null ? C : S, ref: l2, type: a.value, "aria-expanded": e.disclosureState.value === 0, "aria-controls": e.disclosureState.value === 0 || o$1(e.panel) ? e.panelId.value : void 0, disabled: t2.disabled ? true : void 0, onClick: c, onKeydown: D, onKeyup: v };
    return A({ ourProps: M, theirProps: K, slot: u2, attrs: r, slots: o$2, name: "DisclosureButton" });
  };
} }), V = defineComponent({ name: "DisclosurePanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, id: { type: String, default: null } }, setup(t2, { attrs: r, slots: o2, expose: s2 }) {
  let e = O("DisclosurePanel");
  onMounted(() => {
    t2.id !== null && (e.panelId.value = t2.id);
  }), onUnmounted(() => {
    e.panelId.value = null;
  }), s2({ el: e.panel, $el: e.panel }), provide(k, e.panelId);
  let i$1 = l(), n = computed(() => i$1 !== null ? (i$1.value & i.Open) === i.Open : e.disclosureState.value === 0);
  return () => {
    var v;
    let l2 = { open: e.disclosureState.value === 0, close: e.close }, { id: a, ...c } = t2, D = { id: (v = e.panelId.value) != null ? v : a, ref: e.panel };
    return A({ ourProps: D, theirProps: c, slot: l2, attrs: r, slots: o2, features: N$1.RenderStrategy | N$1.Static, visible: n.value, name: "DisclosurePanel" });
  };
} });
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.accordion, accordion);
const configButton = mergeConfig(appConfig.ui.strategy, appConfig.ui.button, button);
const _sfc_main$1 = defineComponent({
  components: {
    HDisclosure: N,
    HDisclosureButton: Q,
    HDisclosurePanel: V,
    UIcon: __nuxt_component_2,
    UButton: __nuxt_component_3
  },
  inheritAttrs: false,
  props: {
    items: {
      type: Array,
      default: () => []
    },
    defaultOpen: {
      type: Boolean,
      default: false
    },
    openIcon: {
      type: String,
      default: () => config.default.openIcon
    },
    unmount: {
      type: Boolean,
      default: false
    },
    closeIcon: {
      type: String,
      default: () => config.default.closeIcon
    },
    multiple: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["open"],
  setup(props, { emit }) {
    const { ui, attrs } = useUI("accordion", toRef(props, "ui"), config, toRef(props, "class"));
    const uiButton = computed(() => configButton);
    const buttonRefs = ref([]);
    const openedStates = computed(() => buttonRefs.value.map(({ open }) => open));
    watch(openedStates, (newValue, oldValue) => {
      for (const index in newValue) {
        const isOpenBefore = oldValue[index];
        const isOpenAfter = newValue[index];
        if (!isOpenBefore && isOpenAfter) {
          emit("open", index);
        }
      }
    }, { immediate: true });
    function closeOthers(currentIndex, e) {
      if (!props.items[currentIndex].closeOthers && props.multiple) {
        return;
      }
      buttonRefs.value.forEach((button2) => {
        if (button2.open) {
          button2.close(e.target);
        }
      });
    }
    function onEnter(_el, done) {
      const el = _el;
      el.style.height = "0";
      el.offsetHeight;
      el.style.height = el.scrollHeight + "px";
      el.addEventListener("transitionend", done, { once: true });
    }
    function onBeforeLeave(_el) {
      const el = _el;
      el.style.height = el.scrollHeight + "px";
      el.offsetHeight;
    }
    function onAfterEnter(_el) {
      const el = _el;
      el.style.height = "auto";
    }
    function onLeave(_el, done) {
      const el = _el;
      el.style.height = "0";
      el.addEventListener("transitionend", done, { once: true });
    }
    l$1(() => useId("$SZ7s8siktv"));
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      uiButton,
      attrs,
      buttonRefs,
      closeOthers,
      omit,
      onEnter,
      onBeforeLeave,
      onAfterEnter,
      onLeave
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_HDisclosure = resolveComponent("HDisclosure");
  const _component_HDisclosureButton = resolveComponent("HDisclosureButton");
  const _component_UButton = __nuxt_component_3;
  const _component_UIcon = __nuxt_component_2;
  const _component_HDisclosurePanel = resolveComponent("HDisclosurePanel");
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: _ctx.ui.wrapper
  }, _attrs))}><!--[-->`);
  ssrRenderList(_ctx.items, (item, index) => {
    _push(ssrRenderComponent(_component_HDisclosure, {
      key: index,
      as: "div",
      class: _ctx.ui.container,
      "default-open": _ctx.defaultOpen || item.defaultOpen
    }, {
      default: withCtx(({ open, close }, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(ssrRenderComponent(_component_HDisclosureButton, {
            ref_for: true,
            ref: () => _ctx.buttonRefs[index] = { open, close },
            as: "template",
            disabled: item.disabled,
            onClick: ($event) => _ctx.closeOthers(index, $event),
            onKeydown: [($event) => _ctx.closeOthers(index, $event), ($event) => _ctx.closeOthers(index, $event)]
          }, {
            default: withCtx((_, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                ssrRenderSlot(_ctx.$slots, "default", {
                  item,
                  index,
                  open,
                  close
                }, () => {
                  _push3(ssrRenderComponent(_component_UButton, mergeProps({ ref_for: true }, { ..._ctx.omit(_ctx.ui.default, ["openIcon", "closeIcon"]), ..._ctx.attrs, ..._ctx.omit(item, ["slot", "disabled", "content", "defaultOpen"]) }), {
                    trailing: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UIcon, {
                          name: !open ? _ctx.openIcon : _ctx.closeIcon ? _ctx.closeIcon : _ctx.openIcon,
                          class: [
                            open && !_ctx.closeIcon ? "-rotate-180" : "",
                            _ctx.uiButton.icon.size[item.size || _ctx.uiButton.default.size],
                            _ctx.ui.item.icon
                          ]
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: !open ? _ctx.openIcon : _ctx.closeIcon ? _ctx.closeIcon : _ctx.openIcon,
                            class: [
                              open && !_ctx.closeIcon ? "-rotate-180" : "",
                              _ctx.uiButton.icon.size[item.size || _ctx.uiButton.default.size],
                              _ctx.ui.item.icon
                            ]
                          }, null, 8, ["name", "class"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                }, _push3, _parent3, _scopeId2);
              } else {
                return [
                  renderSlot(_ctx.$slots, "default", {
                    item,
                    index,
                    open,
                    close
                  }, () => [
                    createVNode(_component_UButton, mergeProps({ ref_for: true }, { ..._ctx.omit(_ctx.ui.default, ["openIcon", "closeIcon"]), ..._ctx.attrs, ..._ctx.omit(item, ["slot", "disabled", "content", "defaultOpen"]) }), {
                      trailing: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: !open ? _ctx.openIcon : _ctx.closeIcon ? _ctx.closeIcon : _ctx.openIcon,
                          class: [
                            open && !_ctx.closeIcon ? "-rotate-180" : "",
                            _ctx.uiButton.icon.size[item.size || _ctx.uiButton.default.size],
                            _ctx.ui.item.icon
                          ]
                        }, null, 8, ["name", "class"])
                      ]),
                      _: 2
                    }, 1040)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
          _push2(``);
          if (_ctx.unmount) {
            _push2(ssrRenderComponent(_component_HDisclosurePanel, {
              class: [_ctx.ui.item.base, _ctx.ui.item.size, _ctx.ui.item.color, _ctx.ui.item.padding],
              unmount: ""
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, item.slot || "item", {
                    item,
                    index,
                    open,
                    close
                  }, () => {
                    _push3(`${ssrInterpolate(item.content)}`);
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, item.slot || "item", {
                      item,
                      index,
                      open,
                      close
                    }, () => [
                      createTextVNode(toDisplayString(item.content), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            _push2(`<div style="${ssrRenderStyle(open ? null : { display: "none" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_HDisclosurePanel, {
              class: [_ctx.ui.item.base, _ctx.ui.item.size, _ctx.ui.item.color, _ctx.ui.item.padding],
              static: ""
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, item.slot || "item", {
                    item,
                    index,
                    open,
                    close
                  }, () => {
                    _push3(`${ssrInterpolate(item.content)}`);
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, item.slot || "item", {
                      item,
                      index,
                      open,
                      close
                    }, () => [
                      createTextVNode(toDisplayString(item.content), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          }
        } else {
          return [
            createVNode(_component_HDisclosureButton, {
              ref_for: true,
              ref: () => _ctx.buttonRefs[index] = { open, close },
              as: "template",
              disabled: item.disabled,
              onClick: ($event) => _ctx.closeOthers(index, $event),
              onKeydown: [
                withKeys(($event) => _ctx.closeOthers(index, $event), ["enter"]),
                withKeys(($event) => _ctx.closeOthers(index, $event), ["space"])
              ]
            }, {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "default", {
                  item,
                  index,
                  open,
                  close
                }, () => [
                  createVNode(_component_UButton, mergeProps({ ref_for: true }, { ..._ctx.omit(_ctx.ui.default, ["openIcon", "closeIcon"]), ..._ctx.attrs, ..._ctx.omit(item, ["slot", "disabled", "content", "defaultOpen"]) }), {
                    trailing: withCtx(() => [
                      createVNode(_component_UIcon, {
                        name: !open ? _ctx.openIcon : _ctx.closeIcon ? _ctx.closeIcon : _ctx.openIcon,
                        class: [
                          open && !_ctx.closeIcon ? "-rotate-180" : "",
                          _ctx.uiButton.icon.size[item.size || _ctx.uiButton.default.size],
                          _ctx.ui.item.icon
                        ]
                      }, null, 8, ["name", "class"])
                    ]),
                    _: 2
                  }, 1040)
                ])
              ]),
              _: 2
            }, 1032, ["disabled", "onClick", "onKeydown"]),
            createVNode(Transition, mergeProps({ ref_for: true }, _ctx.ui.transition, {
              onEnter: _ctx.onEnter,
              onAfterEnter: _ctx.onAfterEnter,
              onBeforeLeave: _ctx.onBeforeLeave,
              onLeave: _ctx.onLeave
            }), {
              default: withCtx(() => [
                _ctx.unmount ? (openBlock(), createBlock(_component_HDisclosurePanel, {
                  key: 0,
                  class: [_ctx.ui.item.base, _ctx.ui.item.size, _ctx.ui.item.color, _ctx.ui.item.padding],
                  unmount: ""
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, item.slot || "item", {
                      item,
                      index,
                      open,
                      close
                    }, () => [
                      createTextVNode(toDisplayString(item.content), 1)
                    ])
                  ]),
                  _: 2
                }, 1032, ["class"])) : withDirectives((openBlock(), createBlock("div", { key: 1 }, [
                  createVNode(_component_HDisclosurePanel, {
                    class: [_ctx.ui.item.base, _ctx.ui.item.size, _ctx.ui.item.color, _ctx.ui.item.padding],
                    static: ""
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, item.slot || "item", {
                        item,
                        index,
                        open,
                        close
                      }, () => [
                        createTextVNode(toDisplayString(item.content), 1)
                      ])
                    ]),
                    _: 2
                  }, 1032, ["class"])
                ], 512)), [
                  [vShow, open]
                ])
              ]),
              _: 2
            }, 1040, ["onEnter", "onAfterEnter", "onBeforeLeave", "onLeave"])
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Accordion.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "results",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a;
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { data: exam } = ([__temp, __restore] = withAsyncContext(() => useFetch(`/api/exams/:${id}`, "$KloFVAFkYc")), __temp = await __temp, __restore(), __temp);
    const questions = computed(() => {
      var _a3;
      var _a2;
      return (_a3 = (_a2 = exam.value) == null ? void 0 : _a2.questions) != null ? _a3 : [];
    });
    const answers = computed(() => {
      var _a3;
      var _a2;
      return (_a3 = (_a2 = exam.value) == null ? void 0 : _a2.answers) != null ? _a3 : [];
    });
    if (answers.value.length !== questions.value.length) {
      console.log(questions.value);
      console.log(answers.value);
      throw new Error(
        `Questions length (${(_a = questions.value) == null ? void 0 : _a.length}) and answers (${answers.value.length}) not same length; something is wrong!`
      );
    }
    const items = [
      {
        label: "Show questions & answers",
        icon: "i-heroicons-information-circle",
        defaultOpen: false,
        slot: "exam"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      const _component_UAccordion = __nuxt_component_0;
      const _component_UTextarea = __nuxt_component_0$1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_UAccordion, { items }, {
        exam: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="leading-relaxed"${_scopeId}><!--[-->`);
            ssrRenderList(unref(questions), (_2, idx) => {
              _push2(`<div${_scopeId}><label${_scopeId}>${ssrInterpolate(unref(questions)[idx])} `);
              _push2(ssrRenderComponent(_component_UTextarea, {
                autoresize: "",
                class: "my-2",
                modelValue: unref(answers)[idx],
                "onUpdate:modelValue": ($event) => unref(answers)[idx] = $event,
                disabled: true
              }, null, _parent2, _scopeId));
              _push2(`</label></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "leading-relaxed" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(questions), (_2, idx) => {
                  return openBlock(), createBlock("div", null, [
                    createVNode("label", null, [
                      createTextVNode(toDisplayString(unref(questions)[idx]) + " ", 1),
                      createVNode(_component_UTextarea, {
                        autoresize: "",
                        class: "my-2",
                        modelValue: unref(answers)[idx],
                        "onUpdate:modelValue": ($event) => unref(answers)[idx] = $event,
                        disabled: true
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ]);
                }), 256))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="mt-4"><h2 class="font-bold">Feedback</h2><div class="whitespace-pre-wrap">${ssrInterpolate((_a2 = unref(exam)) == null ? void 0 : _a2.feedback)}</div></section><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/exams/[id]/results.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=results-H6eS1EAA.mjs.map
