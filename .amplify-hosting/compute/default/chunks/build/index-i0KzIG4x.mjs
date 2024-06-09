import { a as useAuth, n as navigateTo, d as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_3 } from './Button-C9mGLMtE.mjs';
import { useSSRContext, defineComponent, withAsyncContext, mergeProps, withCtx, createVNode, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
import 'tailwind-merge';
import './nuxt-link-DPBnjplD.mjs';
import './Icon-BTndY_Cj.mjs';
import './Icon-COXSlKhV.mjs';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import './index-Cj2Bc71W.mjs';
import './selectMenu-CW6COth7.mjs';

const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "31.27",
    height: "32",
    viewBox: "0 0 256 262"
  }, _attrs))}><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GoogleIcon.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SignInGoogle",
  __ssrInlineRender: true,
  setup(__props) {
    function handleGoogleAuth() {
      signIn("google");
    }
    const { signIn } = useAuth();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_3;
      const _component_GoogleIcon = __nuxt_component_1;
      _push(`<p${ssrRenderAttrs(mergeProps({ class: "flex justify-center" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UButton, { onClick: handleGoogleAuth }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_GoogleIcon, { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Continue with Google`);
          } else {
            return [
              createVNode(_component_GoogleIcon, { class: "h-4 w-4" }),
              createTextVNode(" Continue with Google")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SignInGoogle.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a;
    let __temp, __restore;
    const { data } = useAuth();
    if ((_a = data.value) == null ? void 0 : _a.user) {
      [__temp, __restore] = withAsyncContext(() => navigateTo("/app")), await __temp, __restore();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_SignInGoogle = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLayout, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-center h-screen text-center"${_scopeId}><div class="flex flex-col items-center justify-center"${_scopeId}><h1 class="font-mono text-7xl mb-12"${_scopeId}>StudyHQ</h1><p class="text-3xl mb-8"${_scopeId}> AI powered revision, exam generator and grader. </p><p class="mb-8"${_scopeId}> Sign in below to start studying and taking practice exams and get $5.00 free credits! </p><div class="mb-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_SignInGoogle, null, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-center h-screen text-center" }, [
                createVNode("div", { class: "flex flex-col items-center justify-center" }, [
                  createVNode("h1", { class: "font-mono text-7xl mb-12" }, "StudyHQ"),
                  createVNode("p", { class: "text-3xl mb-8" }, " AI powered revision, exam generator and grader. "),
                  createVNode("p", { class: "mb-8" }, " Sign in below to start studying and taking practice exams and get $5.00 free credits! "),
                  createVNode("div", { class: "mb-8" }, [
                    createVNode(_component_SignInGoogle)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-i0KzIG4x.mjs.map
