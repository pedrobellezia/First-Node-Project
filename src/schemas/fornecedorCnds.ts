import * as z from "zod";
import { orderByCndType, whereCndType } from "./cndtype.js";
import { orderByFornecedor, whereFornecedor } from "./fornecedor.js";

const whereFornecedorCnds = z
  .object({
    id: z.string().optional(),
    fornecedorid: z.string().optional(),
    cndtypeid: z.string().optional(),
    ativo: z
      .any()
      .transform(() => true)
      .optional(),
  })
  .strict();

const orderByFornecedorCnds = z.object({
  createdAt: z.enum(["asc", "desc"]).optional(),
});

const includeFornecedorCnds = z.object({
  fornecedor: z.object({
    where: whereFornecedor,
    orderBy: orderByFornecedor,
  }),
  cndType: z.object({
    where: whereCndType,
    orderBy: orderByCndType,
  }),
});

const queryFornecedorCnds = z.object({
  where: whereFornecedorCnds.optional(),
  orderBy: orderByFornecedorCnds.optional(),
  include: includeFornecedorCnds.optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

const newFornecedorCnds = z
  .object({
    cndtypeid: z.string(),
    fornecedorid: z.string(),
  })
  .strict();

export {
  newFornecedorCnds,
  queryFornecedorCnds,
  orderByFornecedorCnds,
  whereFornecedorCnds,
};
