import { readFiles } from "h3-formidable";
import fs from "node:fs";
import { rename } from "node:fs/promises";
import path from "path";
import { openai } from "~/server/open_ai";

export default eventHandler(async (event) => {
  const { files } = await readFiles(event, {
    // formidable options
    // https://github.com/node-formidable/formidable#options
  });

  const allFiles = Object.values(files).map((x) => x![0]);

  const fileIds = await Promise.all(
    allFiles.map(async (file) => {
      const ext = path.extname(file.originalFilename!);
      const newname = `${file.filepath}${ext}`;
      console.log(`Uploading`, newname);
      await rename(file.filepath, newname);
      return openai.files.create({
        file: fs.createReadStream(newname),
        purpose: "assistants",
      });
    }),
  );

  return { fileIds: fileIds.map((x) => x.id) };

  // for (const fileId of fileIds) {
  //   const uploaded = await openai.beta.threads.messages.create("", {
  //     role: "user",
  //     content: [
  //       {
  //         type: "image_file",
  //         image_file: {
  //           file_id: fileId.id,
  //         },
  //       },
  //     ],
  //   });
  // }

  // for (const file of Object.values(files)) {

  // console.log(file?.[0].filepath, file?.[0]);
  // }
});
