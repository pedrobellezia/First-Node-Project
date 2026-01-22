import * as z from "zod";
import {
  orderByFornecedorCnds,
  anti_circular_import,
  whereFornecedorCnds,
} from "./fornecedorCnds.js";
import { selectCndType } from "./cndtype.js";

function check_limit(data: any) {
  return;
}
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
  FornecedorCnds: z.union([
    z.boolean(),
    z.object({
      where: whereFornecedorCnds.optional(),
      orderBy: orderByFornecedorCnds.optional(),
      include: z
        .object({
          CndType: z.boolean().optional(),
        })
        .optional(),
    }),
  ]),
});

const aci_fornecedor = {
  id: z.boolean().optional(),
  cnpj: z.boolean().optional(),
  name: z.boolean().optional(),
  uf: z.boolean().optional(),
  municipio: z.boolean().optional(),
  createdAt: z.boolean().optional(),
};

const selectFornecedor = z.object({
  ...aci_fornecedor,
  FornecedorCnds: z
    .boolean()
    .or(
      z.lazy(() =>
        z.object({
          select: z.object({
            ...anti_circular_import,
            CndType: z.boolean().or(z.lazy(() => z.object({ select: z.lazy(() => selectCndType) }))).optional(),
          }),
        }),
      ),
    )
    .optional(),
});

const queryFornecedor = z
  .object({
    where: whereFornecedor.optional(),
    orderBy: orderByFornecedor.optional(),
    include: includeFornecedor.optional(),
    limit: z.number().positive().max(50).optional(),
    page: z.number().int().min(1).optional(),
    select: selectFornecedor.optional(),
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

const newFornecedor = z
  .object({
    cnpj: z.string(),
    name: z.string(),
    uf: z.string(),
    municipio: z.string(),
  })
  .strict();

export {
  queryFornecedor,
  whereFornecedor,
  orderByFornecedor,
  newFornecedor,
  aci_fornecedor,
  selectFornecedor,
};
