import { _ as __nuxt_component_0 } from './Textarea-CZLiAeIV.mjs';
import { _ as __nuxt_component_3 } from './Button-C9mGLMtE.mjs';
import { defineComponent, ref, unref, isRef, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import 'tailwind-merge';
import '../../index.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import './selectMenu-CW6COth7.mjs';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';
import './nuxt-link-DPBnjplD.mjs';
import './Icon-BTndY_Cj.mjs';
import './Icon-COXSlKhV.mjs';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import './index-Cj2Bc71W.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const submitting = ref(false);
    const msg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UTextarea = __nuxt_component_0;
      const _component_UButton = __nuxt_component_3;
      _push(`<!--[--><p class="leading-relaxed mb-2"> Welcome to practice exams. Enter the content below, and get a personalized exam. You can copy paste lecture notes, articles, anything! </p><p class="leading-relaxed mb-2"> Once you complete the exam, you&#39;ll receive grades and an explanation telling you where you went wrong. </p><form class="flex flex-col items-end">`);
      _push(ssrRenderComponent(_component_UTextarea, {
        modelValue: unref(msg),
        "onUpdate:modelValue": ($event) => isRef(msg) ? msg.value = $event : null,
        autoresize: "",
        placeholder: "Exam content...",
        maxrows: 20,
        disabled: unref(submitting),
        class: "w-full mb-2",
        ref: "textAreaRef"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        disabled: unref(submitting),
        loading: unref(submitting)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Generate`);
          } else {
            return [
              createTextVNode("Generate")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/exams/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=new-0Mn8SlDQ.mjs.map
