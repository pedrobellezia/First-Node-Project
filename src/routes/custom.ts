import { prisma } from "../lib/prisma.js";
import { Router } from "express";
import ApiResponseHandler from "../lib/response.js";

const customRoute = Router();

// Dado um fornecedorId, retorna todas as CNDs vinculadas
customRoute.get("/get_cnds", async (req, res) => {
  try {
    const cnpj = req.query.cnpj ? (req.query.cnpj as string) : undefined;
    const tipos = req.query.tipos
      ? (req.query.tipos as string).split(",")
      : undefined;
    const ativo =
      req.query.ativo !== undefined ? req.query.ativo === "true" : undefined;

    if (!cnpj) {
      ApiResponseHandler.error(res, "CNPJ é obrigatório", undefined, 400);
      return;
    }

    const exist =
      (await prisma.fornecedor.count({
        where: { cnpj },
      })) < 0;

    if (exist) {
      ApiResponseHandler.notFound(res, "Fornecedor");
      return;
    }

    const r = await prisma.fornecedorCategory.findMany({
      select: {
        cnd: {
          select: {
            file_name: true,
            emissao: true,
            negativa: true,
            validade: true,
          },
          where: {
            ativo,
          },
        },
        fornecedor: { select: { cnpj: true, name: true } },
        cndCategory: {
          select: {
            cndType: { select: { tipo: true } },
          },
        },
      },
      where: {
        fornecedor: { cnpj },
        cndCategory: {
          cndType: {
            tipo: {
              in: tipos,
            },
          },
        },
      },
    });

    const formattedData = r.map((a) => ({
      cnpj: a.fornecedor.cnpj || null,
      name: a.fornecedor.name || null,
      cnd: {
        emissao: a.cnd?.[0]?.emissao
          ? new Date(a.cnd?.[0]?.emissao).toLocaleDateString("pt-BR")
          : null,
        negativa: a.cnd?.[0]?.negativa,
        validade: a.cnd?.[0]?.validade
          ? new Date(a.cnd?.[0]?.validade).toLocaleDateString("pt-BR")
          : null,
        tipo: a.cndCategory.cndType.tipo || null,
        filename: a.cnd?.[0]?.file_name || null,
      },
    }));

    ApiResponseHandler.success(res, formattedData);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[GET /get_cnds]", error);
  }
});

export default customRoute;
