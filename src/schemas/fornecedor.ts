import * as z from "zod";
import {
  orderByFornecedorCnds,
  whereFornecedorCnds,
} from "./fornecedorCnds.js";

const whereFornecedor = z
  .object({
    ativo: z
      .any()
      .transform(() => true)
      .optional(),
    cnpj: z.string().optional(),
    name: z.string().optional(),
    uf: z.string().optional(),
    municipio: z.string().optional(),
    id: z.string().optional(),
  })
  .strict();

const orderByFornecedor = z.object({
  cnpj: z.enum(["asc", "desc"]).optional(),
  name: z.enum(["asc", "desc"]).optional(),
  uf: z.enum(["asc", "desc"]).optional(),
  municipio: z.enum(["asc", "desc"]).optional(),
  id: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
});

const includeFornecedor = z.object({
  FornecedorCnds: z.object({
    where: whereFornecedorCnds,
    orderBy: orderByFornecedorCnds,
  }),
});

const queryFornecedor = z.object({
  where: whereFornecedor.optional(),
  orderBy: orderByFornecedor.optional(),
  include: includeFornecedor.optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

const newFornecedor = z
  .object({
    cnpj: z.string(),
    name: z.string(),
    uf: z.string(),
    municipio: z.string(),
  })
  .strict();

export { queryFornecedor, whereFornecedor, orderByFornecedor, newFornecedor };
