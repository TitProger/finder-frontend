import type { StoredFile } from "../../generated/types";
import { apiPaths } from "../../generated/paths";
import { unwrappers } from "../../generated/unwraps";
import type { ApiClient } from "../common/api-client";

export function createFilesApi(client: ApiClient) {
  return {
    uploadStoredFile: (file: File) => {
      const form = new FormData();

      form.append("file", file);

      return client.postFormUnwrapped(
        apiPaths.files.uploadStoredFile,
        unwrappers.files.uploadStoredFile,
        form,
      ) as Promise<StoredFile | null>;
    },
  };
}

export type FilesApi = ReturnType<typeof createFilesApi>;
