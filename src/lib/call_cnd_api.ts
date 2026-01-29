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
  municipio?: string
): Promise<ApiResponse> {
  const filter: CndFilter = {
    tipo,
    ...(tipo === "municipal" && { uf, municipio }),
    ...(tipo === "estadual" && { uf, municipio: null }),
  };

  const cndtype = await prisma.cndType.findFirst({
    where: filter,
  });

  if (!cndtype) {
    throw new Error("cndtype not found");
  }

  const instructions = JSON.stringify(cndtype.instructions)
    .replace("%CNPJ%", cnpj)
    .replace("%API_KEY%", process.env.CAPTCHA_API_KEY!);

  const { data, status } = await api.post("/execute_scrap", instructions);

  const fileResponse = await api.get(`/pdf/${data.files_saved[0].path}`, {
    responseType: "arraybuffer",
  });

  const pdfBuffer = Buffer.from(fileResponse.data);
  const fileName = path.basename(data.files_saved[0].path);
  const outputPath = path.resolve("public", fileName);

  fs.writeFileSync(outputPath, pdfBuffer);

  return {
    status_code: status,
    message: "Success",
    details: data,
  };
}

export default getCndfromApi;
