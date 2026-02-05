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

interface ApiResponse {
  status_code: number;
  message: string;
  details: ApiDetails;
}

async function getCndfromApi(
  cnpj: string,
  tipo: string,
  uf?: string,
  municipio?: string,
) {
  try {
    const filter: CndFilter = {
      tipo,
      ...(tipo === "municipal" && { uf, municipio }),
      ...(tipo === "estadual" && { uf, municipio: null }),
    };

    const cndtype = await prisma.cndType.findFirst({ where: filter });

    if (!cndtype) {
      throw new Error("cndtype not found");
    }

    const instructions = JSON.stringify(cndtype.instructions)
      .replace("%CNPJ%", cnpj)
      .replace("%API_KEY%", process.env.CAPTCHA_API_KEY!);

    const response = await api.post("/execute_scrap", instructions);

    const { files_saved } = response.data;

    if (!files_saved?.length) {
      throw new Error("No files returned by API");
    }

    const pdfPath = files_saved[0].path;

    const fileResponse = await api.get(`/pdf/${pdfPath}`, {
      responseType: "arraybuffer",
    });

    const fileName = path.basename(pdfPath);
    const outputPath = path.resolve("public", fileName);

    fs.writeFileSync(outputPath, Buffer.from(fileResponse.data));

    return {
      status_code: response.status,
      message: "Success",
      details: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        status_code: error.response.status,
        message: error.response.data?.detail?.message ?? "API Error",
        details: error.response.data?.detail?.details ?? {},
      };
    }
    throw error;
  }
}

export default getCndfromApi;
