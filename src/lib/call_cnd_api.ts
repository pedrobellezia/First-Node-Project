import axios from "axios";
import { prisma } from "./prisma.js";
import dotenv from "dotenv";

type CndTipo = "municipal" | "estadual" | "fgts" | "trabalhista";

interface CndFilter {
  tipo: CndTipo;
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
  tipo: CndTipo,
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

  const response = await axios.post(process.env.CND_API_URL!, instructions);
  return {
    status_code: response.status,
    message: "Success",
    details: response.data,
  };
}

export default getCndfromApi;
