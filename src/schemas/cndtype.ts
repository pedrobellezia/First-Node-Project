import * as z from "zod";
import {
  anti_circular_import,
  orderByFornecedorCnds,
  whereFornecedorCnds,
} from "./fornecedorCnds.js";
import { aci_fornecedor } from "./fornecedor.js";

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

const includeCndType = z.object({
  FornecedorCnds: z.union([
    z.boolean(),
    z.object({
      where: z.lazy(() => whereFornecedorCnds).optional(),
      orderBy: z.lazy(() => orderByFornecedorCnds).optional(),
    }),
  ]),
});

const aci_cndType = {
  id: z.boolean().optional(),
  uf: z.boolean().optional(),
  municipio: z.boolean().optional(),
  tipo: z.boolean().optional(),
  instructions: z.boolean().optional(),
  ativo: z.boolean().optional(),
  createdAt: z.boolean().optional(),
};
const selectCndType = z.object({
  ...aci_cndType,
  FornecedorCnds: z
    .boolean()
    .or(
      z.lazy(() =>
        z.object({
          select: z.object({
            ...anti_circular_import,
            Fornecedor: z
              .boolean()
              .or(z.lazy(() => z.object({ select: z.object({ ...aci_fornecedor }) })))
              .optional(),
          }),
        }),
      ),
    )
    .optional(),
});

const queryCndType = z
  .object({
    where: whereCndType.optional(),
    orderBy: orderByCndType.optional(),
    include: includeCndType.optional(),
    limit: z.number().positive().max(50).optional(),
    page: z.number().int().min(1).optional(),
    select: selectCndType.optional(),
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

const newCndType = z
  .object({
    uf: z.string().optional(),
    municipio: z.string().optional(),
    tipo: z.string(),
    instructions: z.object(),
  })
  .strict();

export {
  queryCndType,
  whereCndType,
  orderByCndType,
  newCndType,
  selectCndType,
};
