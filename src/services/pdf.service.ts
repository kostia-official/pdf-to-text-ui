import { AxiosRequestConfig } from "axios";
import { axiosClient } from "../axiosClient";

class PdfService {
  parsePdfTextAbortController: AbortController | null = null;

  async parsePdfText(
    file: File,
    onUploadProgress?: AxiosRequestConfig["onUploadProgress"]
  ): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    this.parsePdfTextAbortController = new AbortController();

    try {
      const { data } = await axiosClient.post("/pdf/parse/text", formData, {
        onUploadProgress,
        signal: this.parsePdfTextAbortController.signal,
      });

      return data.text;
    } finally {
      this.parsePdfTextAbortController = null;
    }
  }

  cancelPdfParse() {
    this.parsePdfTextAbortController?.abort();
  }
}

export const pdfService = new PdfService();
