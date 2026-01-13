import * as z from "zod";

const newCnd = z
  .object({
    cndtypeid: z.string(),
    fornecedorid: z.string(),
  })
  .strict();

const getCnd = z
  .object({
    cndtypeid: z.string(),
    fornecedorid: z.string(),
    id: z.string(),
    filename: z.string(),
  })
  .strict()
  .partial();

const newFornecedor = z
  .object({
    cnpj: z.string(),
    name: z.string(),
    uf: z.string(),
    municipio: z.string(),
  })
  .strict();

const getFornecedor = z
  .object({
    cnpj: z.string(),
    name: z.string(),
    uf: z.string(),
    municipio: z.string(),
    id: z.string(),
  })
  .partial()
  .strict();

const newCndType = z
  .object({
    uf: z.string().optional(),
    municipio: z.string().optional(),
    tipo: z.string(),
    instructions: z.object(),
  })
  .strict();

const getCndType = z
  .object({
    tipo: z.string(),
    uf: z.string(),
    municipio: z.string(),
    id: z.string(),
  })
  .partial()
.strict();

export { newCnd, getCnd, newFornecedor, getFornecedor, newCndType, getCndType };
