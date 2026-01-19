import * as z from "zod";
import {
  orderByFornecedorCnds,
  whereFornecedorCnds,
} from "./fornecedorCnds.js";
const whereCndType = z
  .object({
    ativo: z
      .any()
      .transform(() => true)
      .optional(),
    tipo: z.string().optional(),
    uf: z.string().optional(),
    municipio: z.string().optional(),
    id: z.string().optional(),
  })
  .strict();

const orderByCndType = z.object({
  tipo: z.enum(["asc", "desc"]).optional(),
  uf: z.enum(["asc", "desc"]).optional(),
  municipio: z.enum(["asc", "desc"]).optional(),
  id: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
});

const includeCnd = z.object({
  FornecedorCnds: z.object({
    where: whereFornecedorCnds,
    orderBy: orderByFornecedorCnds,
  }),
});

const queryCndType = z.object({
  where: whereCndType.optional(),
  orderBy: orderByCndType.optional(),
  include: includeCnd.optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

const newCndType = z
  .object({
    uf: z.string().optional(),
    municipio: z.string().optional(),
    tipo: z.string(),
    instructions: z.object(),
  })
  .strict();

export { queryCndType, whereCndType, orderByCndType, newCndType };
