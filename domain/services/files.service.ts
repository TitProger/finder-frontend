import type { StoredFile } from "@shared/api-types";
import { apiClient, createFilesApi } from "@shared/api";

/** Загрузка фото в хранилище. */
export class FilesService {
  private readonly api = createFilesApi(apiClient);

  async upload(file: File): Promise<StoredFile> {
    const data = await this.api.uploadStoredFile(file);

    if (!data) {
      throw new Error("UNKNOWN_ERROR");
    }

    return data;
  }
}

export const filesService = new FilesService();
