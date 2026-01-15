import * as z from "zod";

const getFornecedor = z
  .object({
    cnpj: z.string().optional(),
    name: z.string().optional(),
    uf: z.string().optional(),
    municipio: z.string().optional(),
    id: z.string().optional(),
    include: z
      .object({
        FornecedorCnds: z.union([
          z
            .object({
              include: z
                .object({
                  CndType: z.coerce.boolean(),
                })
                .strict(),
            })
            .strict(),
          z.coerce.boolean(),
        ]),
      })
      .optional(),
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

const getCnd = z
  .object({
    id: z.string().optional(),
    Fornecedor: getFornecedor.optional(),
    CndType: getCndType.optional(),
    include: z
      .object({
        Fornecedor: z.coerce.boolean(),
        CndType: z.coerce.boolean(),
      })
      .optional(),
  })
  .partial();

const newFornecedor = z
  .object({
    cnpj: z.string(),
    name: z.string(),
    uf: z.string(),
    municipio: z.string(),
  })
  .strict();

const newCndType = z
  .object({
    uf: z.string().optional(),
    municipio: z.string().optional(),
    tipo: z.string(),
    instructions: z.object(),
  })
  .strict();

const newCnd = z
  .object({
    cndtypeid: z.string(),
    fornecedorid: z.string(),
  })
  .strict();

export { newCnd, getCnd, newFornecedor, getFornecedor, newCndType, getCndType };
