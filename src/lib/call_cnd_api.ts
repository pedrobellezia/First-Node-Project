import { prisma } from "./prisma.js";
import fs from "fs";
import path from "path";
import api from "./axios.js";

interface CndFilter {
  tipo: string;
  uf?: string;
  municipio?: string | null;
}

interface SavedFile {
  path: string;
}

interface ApiDetails {
  atributes_read: Record<string, unknown>;
  files_saved: SavedFile[];
}

async function downloadPdf(pdfPath: string): Promise<string> {
  const response = await api.get(`/pdf/${pdfPath}`, {
    responseType: "arraybuffer",
  });

  const buffer = Buffer.from(response.data);
  const fileName = path.basename(pdfPath);
  const outputPath = path.resolve("public", fileName);

  fs.writeFileSync(outputPath, buffer);

  console.log(`[PDF] Downloaded successfully: ${outputPath}`);

  return outputPath;
}

async function getCndfromApi(cnpj: string, rawInstructions: string) {
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const instructions = JSON.stringify(rawInstructions)
        .replace("%CNPJ%", cnpj)
        .replace("%API_KEY%", process.env.CAPTCHA_API_KEY!);

      const response = await api.post("/execute_scrap", instructions);

      const { files_saved } = response.data.data;

      if (!files_saved?.length) { 
        throw new Error("No files returned by API");
      }

      const file_name = files_saved[0].path;

      const savedPath = await downloadPdf(file_name);
      console.log(`[CND] PDF saved at: ${savedPath}`);

      return {
        status_code: 200,
        message: "Success",
        details: {
          files_saved: [{ path: file_name }],
          ...response.data.details,
        },
      };
    } catch (error: any) {
      console.warn(
        `[CND] Attempt ${attempt}/${maxAttempts} failed.`        
      );
      console.log(error);

      if (attempt === maxAttempts) {
        if (error.response) {
          return {
            status_code: error.response.status,
            message: error.response.data?.detail?.message ?? "API Error",
            details: error.response.data?.detail?.details ?? {},
          };
        }
        throw error;
      }

      console.log(`[CND] Retrying...`);
    }
  }
}

export default getCndfromApi;
