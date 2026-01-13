import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import getCndfromApi from "../lib/call_cnd_api.js";
import FornecedorManager from "../controllers/fornecedor.js";
import CndTypeManager from "../controllers/cndtype.js";
import { getCnd, newCnd } from "../lib/schemas.js";
import CndManager from "../controllers/cnd.js";

const cndRoute = Router();

cndRoute.post("", async (req, res) => {
  let reqData = await newCnd.safeParseAsync(req.body);

  if (!reqData.success || reqData.data === undefined) {
    res.send(reqData.error.issues);
    return;
  }

  const response = await CndManager.newCnd(
    reqData.data.fornecedorid,
    reqData.data.cndtypeid
  );
  
  res.send(response);
});

cndRoute.get("", async (req, res) => {
  let reqData = await getCnd.safeParseAsync(req.body);

  if (!reqData.success) {
    res.send(reqData.error.issues);
    return;
  }

  res.send(
    await CndManager.getCnd(
      reqData.data.id,
      reqData.data.fornecedorid,
      reqData.data.cndtypeid
    )
  );
});

export default cndRoute;
