import * as z from "zod";
import { selectCndType } from "./cndtype.js";
import { selectFornecedor } from "./fornecedor.js";

const whereFornecedorCnds = z
  .object({
    id: z.string().optional(),
    fornecedorid: z.string().optional(),
    cndtypeid: z.string().optional(),
    vencido: z.boolean().optional(),
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

const anti_circular_import = {
  id: z.boolean().optional(),
  fornecedorid: z.boolean().optional(),
  cndtypeid: z.boolean().optional(),
  file_name: z.boolean().optional(),
  validade: z.boolean().optional(),
  ativo: z.boolean().optional(),
  createdAt: z.boolean().optional(),
};

const selectFornecedorCnds = z.object({
  ...anti_circular_import,
  Fornecedor: z
    .boolean()
    .or(z.lazy(() => z.object({ select: z.lazy(() => selectFornecedor) })))
    .optional(),
  CndType: z
    .boolean()
    .or(z.lazy(() => z.object({ select: z.lazy(() => selectCndType) })))
    .optional(),
});

const queryFornecedorCnds = z
  .object({
    where: whereFornecedorCnds.optional(),
    orderBy: orderByFornecedorCnds.optional(),
    include: includeFornecedorCnds.optional(),
    limit: z.number().positive().max(50).optional(),
    page: z.number().int().min(1).optional(),
    select: selectFornecedorCnds.optional(),
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
  anti_circular_import,
  selectFornecedorCnds,
};
