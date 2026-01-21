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
  Fornecedor: z.boolean(),
  CndType: z.boolean(),
});

const queryFornecedorCnds = z
  .object({
    where: whereFornecedorCnds.optional(),
    orderBy: orderByFornecedorCnds.optional(),
    include: includeFornecedorCnds.optional(),
    limit: z.number().positive().max(50).optional(),
    page: z.number().int().min(1).optional(),
  })
  .refine(
    (data) => {
      return !(data.limit && !data.page);
    },
    {
      message: "page is required when limit is provided",
      path: ["page"],
    },
  );

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
