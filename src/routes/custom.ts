import { prisma } from "../lib/prisma.js";
import { Router } from "express";
import CndManager from "../controllers/cnd.js";
import FornecedorManager from "../controllers/fornecedor.js";
import ApiResponseHandler from "../lib/response.js";

const customRoute = Router();

// Dado um fornecedorId, retorna todas as CNDs vinculadas
customRoute.get("/get_cnds", async (req, res) => {
  try {
    const cnpj = req.query.cnpj ? (req.query.cnpj as string) : null;    
    const tipos = req.query.tipos ? (req.query.tipos as string).split(",") : [];
    const ativo =
      req.query.ativo !== undefined ? req.query.ativo === "true" : undefined;

    if (!cnpj) {
      ApiResponseHandler.error(res, "CNPJ é obrigatório", undefined, 400);
      return;
    }

    const response = FornecedorManager.getFornecedores({
      select: { id: true },
      where: { cnpj },
    });

    if ((await response).length === 0) {
      ApiResponseHandler.notFound(res, "Fornecedor");
      return;
    }

    const fornecedorId = (await response)[0].id;

    if (tipos.length > 0) {
      const existingTypes = await prisma.cndType.findMany({
        where: {
          tipo: { in: tipos },
        },
      });

      if (existingTypes.length !== tipos.length) {
        ApiResponseHandler.error(
          res,
          "Um ou mais tipos de CND não encontrados",
          undefined,
          400,
        );
        return;
      }
    }

    const whereClause: any = {
      fornecedorCategory: {
        fornecedorId,
        ativo: ativo,
      },
      ativo: ativo,
    };
    if (tipos.length > 0) {
      whereClause.fornecedorCategory.cndCategory = {
        cndType: {
          tipo: { in: tipos },
        },
      };
    }

    const cnds = await CndManager.getCnd({
      where: whereClause,
      select: {
        id: true,
        emissao: true,
        validade: true,
        negativa: true,
        fornecedorCategory: {
          select: {
            fornecedor: {
              select: {
                cnpj: true,
                name: true,
              },
            },
            cndCategory: {
              select: {
                cndType: {
                  select: {
                    tipo: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedData = cnds.map((cnd: any) => ({
      emissao: cnd.emissao
        ? new Date(cnd.emissao).toLocaleDateString("pt-BR")
        : null,
      negativa: cnd.negativa,
      validade: cnd.validade
        ? new Date(cnd.validade).toLocaleDateString("pt-BR")
        : null,
      cnpj: cnd.fornecedorCategory?.fornecedor?.cnpj || null,
      name: cnd.fornecedorCategory?.fornecedor?.name || null,
      tipo: cnd.fornecedorCategory?.cndCategory?.cndType?.tipo || null,
    }));

    ApiResponseHandler.success(res, formattedData);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[GET /get_cnds]", error);
  }
});
export default customRoute;
