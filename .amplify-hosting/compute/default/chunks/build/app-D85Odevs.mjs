import { _ as __nuxt_component_0 } from './Container-ByzDIknU.mjs';
import { a as useAuth } from './server.mjs';
import { defineComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import 'tailwind-merge';
import './selectMenu-CW6COth7.mjs';
import '../../index.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const { data } = useAuth();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UContainer = __nuxt_component_0;
      _push(ssrRenderComponent(_component_UContainer, mergeProps({ class: "grid grid-rows-3 gap-y-6 h-full items-center mt-24" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<h2 class="text-xl flex justify-center whitespace-pre"${_scopeId}> Welcome to <span class="font-mono"${_scopeId}>StudyHQ</span>. </h2>`);
            if ((_a = unref(data)) == null ? void 0 : _a.user) {
              _push2(`<div class="flex justify-center"${_scopeId}> Welcome back, ${ssrInterpolate(unref(data).user.name)}. </div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("h2", { class: "text-xl flex justify-center whitespace-pre" }, [
                createTextVNode(" Welcome to "),
                createVNode("span", { class: "font-mono" }, "StudyHQ"),
                createTextVNode(". ")
              ]),
              ((_b = unref(data)) == null ? void 0 : _b.user) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex justify-center"
              }, " Welcome back, " + toDisplayString(unref(data).user.name) + ". ", 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=app-D85Odevs.mjs.map
