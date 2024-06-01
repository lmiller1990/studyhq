import { defineStore } from "pinia";

interface ThreadsState {
  threads: Array<{
    id: string;
    openai_id: string;
    created_at: number;
  }>;
}

export const useThreadsStore = defineStore("threads", {
  state: (): ThreadsState => ({
    threads: [],
  }),
  actions: {
    async fetch() {
      const threads = await $fetch("/api/threads");
      this.threads = threads.map((x) => {
        return {
          id: x.id,
          openai_id: x.openai_id,
          created_at: x.created_at,
        };
      });
    },
  },
});
