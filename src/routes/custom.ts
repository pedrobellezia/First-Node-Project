import { Router } from "express";
import CndTypeManager from "../controllers/cndType.js";
import { newCndType, queryCndType } from "../schemas/cndType.js";

const customRoute = Router();

customRoute.get("check_cnds:forencedor id", async (req, res) => {
  try {
    
  } catch (error) {
    console.error("[GET /check_cnds] Erro:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

