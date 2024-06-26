import { d as defineEventHandler } from '../../runtime.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

const hello = defineEventHandler(async (event) => {
  return "OK!";
});

export { hello as default };
//# sourceMappingURL=hello.mjs.map
