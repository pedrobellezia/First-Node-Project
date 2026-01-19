import { Router } from "express";
import CndTypeManager from "../controllers/cndtype.js";
import { newCndType, queryCndType } from "../schemas/cndtype.js";

const cndtypeRoute = Router();

cndtypeRoute.post("", async (req, res) => {
  let data = await newCndType.safeParseAsync(req.body);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const cnd = await CndTypeManager.newCndType(
    data.data.uf,
    data.data.municipio,
    data.data.tipo,
    data.data.instructions
  );

  res.json({
    success: true,
    data: cnd,
  });
});

cndtypeRoute.get("", async (req, res) => {
  let data = await queryCndType.safeParseAsync(req.query);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const cnd = await CndTypeManager.getCndType(data.data);
  res.json({
    success: true,
    data: cnd,
  });
});

export default cndtypeRoute;
