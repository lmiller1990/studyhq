import { _ as __nuxt_component_2 } from './Icon-CfnVCWfk.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-DPBnjplD.mjs';
import { _ as __nuxt_component_0$1 } from './Textarea-CZLiAeIV.mjs';
import { _ as __nuxt_component_3 } from './Button-CHDquoFg.mjs';
import { b as useRoute, n as navigateTo } from './server.mjs';
import { u as useFetch } from './fetch-CTjB-max.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { u as useLoading } from './useLoading-Z0fI2eoC.mjs';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import './Icon-DfRtqKOF.mjs';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import './index-BETvu_7i.mjs';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'tailwind-merge';
import './selectMenu-CW6COth7.mjs';
import '@vueuse/core';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { data: exam, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(`/api/exams/:${id}`, "$z42zBENaXC")), __temp = await __temp, __restore(), __temp);
    const questionsAndAnswers = computed(
      () => {
        var _a2;
        var _a;
        return ((_a2 = (_a = exam.value) == null ? void 0 : _a.questions) != null ? _a2 : []).map((question, idx) => {
          var _a22;
          return {
            question,
            answer: ((_a22 = exam.value) == null ? void 0 : _a22.answers[idx]) || ""
          };
        });
      }
    );
    const submitted = ref(false);
    async function submitExam() {
      submitted.value = true;
      await $fetch("/api/exams/grade", {
        method: "POST",
        body: {
          id,
          questions: questionsAndAnswers.value.map(({ question, answer }) => ({
            question,
            answer: answer != null ? answer : "No answer provided."
          }))
        }
      });
      submitted.value = false;
      await navigateTo(`/exams/${id}/results`);
    }
    async function resetExam() {
      submitted.value = true;
      await $fetch(`/api/exams/${id}/reset`, {
        method: "POST"
      });
      submitted.value = false;
      await refresh();
    }
    const { run: handleSubmitExam, loading } = useLoading(submitExam);
    const { run: handleReset, loading: resetting } = useLoading(resetExam);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_UIcon = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UTextarea = __nuxt_component_0$1;
      const _component_UButton = __nuxt_component_3;
      _push(`<!--[-->`);
      if ((_a = unref(exam)) == null ? void 0 : _a.completed) {
        _push(`<p class="mb-4"><span class="text-red-500">`);
        _push(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-exclamation-circle" }, null, _parent));
        _push(`</span> This exam has already been submitted. `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "border-bottom border-b-green-400 border-b-2",
          to: `/exams/${unref(id)}/results`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Click here`);
            } else {
              return [
                createTextVNode("Click here")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(` to see the feedback. <button class="border-bottom border-b-green-400 border-b-2"> Click here </button> to take it again. `);
        if (unref(resetting)) {
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-arrow-path",
            class: "animate-spin"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="leading-relaxed"><!--[-->`);
      ssrRenderList(unref(questionsAndAnswers), (qa, idx) => {
        var _a2;
        _push(`<div><label>${ssrInterpolate(qa.question)} `);
        _push(ssrRenderComponent(_component_UTextarea, {
          class: "my-2",
          placeholder: "Answer...",
          autoresize: "",
          modelValue: qa.answer,
          "onUpdate:modelValue": ($event) => qa.answer = $event,
          disabled: Boolean((_a2 = unref(exam)) == null ? void 0 : _a2.answers[idx]) || unref(submitted),
          rows: 3
        }, null, _parent));
        _push(`</label></div>`);
      });
      _push(`<!--]-->`);
      if (!((_b = unref(exam)) == null ? void 0 : _b.completed)) {
        _push(`<div class="flex flex-col items-end">`);
        _push(ssrRenderComponent(_component_UButton, {
          type: "submit",
          disabled: unref(loading) || unref(submitted),
          loading: unref(loading)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(loading) ? "Grading..." : "Submit")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(loading) ? "Grading..." : "Submit"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/exams/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CXuTT-Xo.mjs.map
