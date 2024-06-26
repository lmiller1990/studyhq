import { _ as __nuxt_component_0 } from './Textarea-CZLiAeIV.mjs';
import { _ as __nuxt_component_3 } from './Button-CHDquoFg.mjs';
import { b as useRoute } from './server.mjs';
import { u as useFetch } from './fetch-CTjB-max.mjs';
import { defineComponent, withAsyncContext, ref, computed, watchEffect, unref, isRef, withCtx, createTextVNode, useSSRContext, nextTick } from 'vue';
import { ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import require$$0$3 from 'events';
import 'tailwind-merge';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import './selectMenu-CW6COth7.mjs';
import '@vueuse/core';
import './nuxt-link-DPBnjplD.mjs';
import './Icon-CfnVCWfk.mjs';
import './Icon-DfRtqKOF.mjs';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import './index-BETvu_7i.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const emitter = new require$$0$3();

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(`/api/threads/${route.params.id}`, "$Q0enI83uGL")), __temp = await __temp, __restore(), __temp);
    const msg = ref("");
    const textAreaRef = ref();
    const localMessages = ref([]);
    const allMessages = computed(() => {
      var _a2;
      var _a;
      return [
        createTempMsg(
          "Hi \u{1F44B} I am here to help you learn about whatever you want. Over to you!",
          "system"
        )
      ].concat((_a2 = (_a = data.value) == null ? void 0 : _a.messages) != null ? _a2 : []).concat(localMessages.value);
    });
    const submitting = ref(false);
    const firstUserMessage = computed(() => {
      const f = allMessages.value[1];
      if (f && f.content[0].type === "text") {
        return f.content[0].text.value;
      }
    });
    watchEffect(async () => {
      var _a;
      if (firstUserMessage.value && !((_a = data.value) == null ? void 0 : _a.summary)) {
        await $fetch("/api/summary", {
          method: "POST",
          body: {
            message: firstUserMessage.value,
            threadId: route.params.id
          }
        });
        emitter.emit("refresh.threads");
      }
    });
    async function handleSubmitMessage() {
      var _a;
      if (submitting.value) {
        return;
      }
      submitting.value = true;
      const cachedMsg = msg.value.trim();
      localMessages.value.push(createTempMsg(cachedMsg, "user"));
      msg.value = "";
      const temp = createTempMsg("", "system");
      localMessages.value.push(temp);
      const last = localMessages.value.at(-1);
      const response = await (void 0).fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          threadId: id,
          message: cachedMsg
        })
      });
      const reader = (_a = response == null ? void 0 : response.body) == null ? void 0 : _a.getReader();
      return new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            var text = new TextDecoder().decode(value);
            if (last.content[0].type === "text") {
              last.content[0].text.value += text;
            }
            if (done) {
              submitting.value = false;
              break;
            }
            controller.enqueue(value);
          }
          controller.close();
          reader.releaseLock();
        }
      });
    }
    function createTempMsg(msgText, role) {
      const ts = Date.now() / 1e3;
      return {
        id: `msg_${ts}`,
        object: "thread.message",
        created_at: ts,
        completed_at: null,
        incomplete_at: null,
        incomplete_details: null,
        status: "completed",
        assistant_id: null,
        thread_id: "thread_u8Q8ApUiYHscxazWTDMq4xNH",
        run_id: null,
        role,
        content: [
          {
            type: "text",
            text: {
              value: msgText,
              annotations: []
            }
          }
        ],
        attachments: [],
        metadata: {}
      };
    }
    function handleKeydown(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        nextTick(handleSubmitMessage);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UTextarea = __nuxt_component_0;
      const _component_UButton = __nuxt_component_3;
      _push(`<!--[--><ul class="leading-relaxed"><!--[-->`);
      ssrRenderList(unref(allMessages), (message) => {
        var _a;
        _push(`<li class="${ssrRenderClass([{ "justify-end": message.role === "user" }, "flex w-full my-4"])}">`);
        if (((_a = message.content[0]) == null ? void 0 : _a.type) === "text") {
          _push(`<div class="${ssrRenderClass([{
            "bg-gray-200 dark:bg-gray-700": message.role === "user",
            "max-w-[50vw]": message.role === "user"
          }, "p-1 rounded px-2 whitespace-pre-wrap"])}">${ssrInterpolate(message.content[0].text.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul><form class="flex flex-col items-end">`);
      _push(ssrRenderComponent(_component_UTextarea, {
        modelValue: unref(msg),
        "onUpdate:modelValue": ($event) => isRef(msg) ? msg.value = $event : null,
        autoresize: "",
        placeholder: "Chat...",
        maxrows: 20,
        onKeydown: handleKeydown,
        class: "w-full mb-2",
        ref_key: "textAreaRef",
        ref: textAreaRef
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        disabled: unref(submitting) || !unref(msg).length
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Send`);
          } else {
            return [
              createTextVNode("Send")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/threads/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CrfzQIFA.mjs.map
