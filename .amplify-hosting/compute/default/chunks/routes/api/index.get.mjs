import { d as defineEventHandler } from '../../../index.mjs';
import { o as openai } from '../../_/open_ai.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'node:fs';
import 'node:url';
import 'openai';

const index_get = defineEventHandler(async (event) => {
  const assistants = await openai.beta.assistants.list();
  return assistants;
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
