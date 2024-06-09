import { _ as __nuxt_component_0 } from './Container-ByzDIknU.mjs';
import { _ as __nuxt_component_2 } from './Icon-BTndY_Cj.mjs';
import { b as useRoute } from './server.mjs';
import { u as useFetch } from './fetch-CTjB-max.mjs';
import { defineComponent, withAsyncContext, computed, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import 'tailwind-merge';
import './selectMenu-CW6COth7.mjs';
import './Icon-COXSlKhV.mjs';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import './index-Cj2Bc71W.mjs';
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
  __name: "grading",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { data: exam } = ([__temp, __restore] = withAsyncContext(() => useFetch(`/api/exams/:${id}`, "$R536Ng7IOm")), __temp = await __temp, __restore(), __temp);
    computed(
      () => {
        var _a2;
        var _a;
        return ((_a2 = (_a = exam.value) == null ? void 0 : _a.questions) != null ? _a2 : []).map((question) => ({ question, answer: "" }));
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UContainer = __nuxt_component_0;
      const _component_UIcon = __nuxt_component_2;
      _push(ssrRenderComponent(_component_UContainer, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col justify-center items-center mt-48"${_scopeId}><p${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-arrow-path",
              class: "animate-spin"
            }, null, _parent2, _scopeId));
            _push2(` Grading in progress ... </p></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col justify-center items-center mt-48" }, [
                createVNode("p", null, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-arrow-path",
                    class: "animate-spin"
                  }),
                  createTextVNode(" Grading in progress ... ")
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/exams/[id]/grading.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=grading-BjEtopgk.mjs.map
