import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import getCndfromApi from "../lib/call_cnd_api.js";
import FornecedorManager from "../controllers/fornecedor.js";
import CndTypeManager from "../controllers/cndtype.js";
import { getCnd, newCnd } from "../lib/schemas.js";
import CndManager from "../controllers/cnd.js";

const cndRoute = Router();

cndRoute.post("", async (req, res) => {
  let data = await newCnd.safeParseAsync(req.body);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const response = await CndManager.newCnd(
    data.data.fornecedorid,
    data.data.cndtypeid
  );
 
  res.json({
    success: true,
    data: response,
  });
});

cndRoute.get("", async (req, res) => {
  let data = await getCnd.safeParseAsync(req.query);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const response = await CndManager.getCnd(
    data.data.id,
    data.data.fornecedorid,
    data.data.cndtypeid
  );
  
  res.json({
    success: true,
    data: response,
  });
  
});

export default cndRoute;
