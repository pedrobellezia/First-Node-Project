import data from "./seed-data.json" assert { type: "json" };
import { prisma } from "../../src/lib/prisma";

async function main() {
  if (data.CndType?.length) {
    await prisma.cndType.createMany({
      data: data.CndType,
      skipDuplicates: true,
    });
  }
  if (data.Fornecedor?.length) {
    await prisma.fornecedor.createMany({
      data: data.Fornecedor,
      skipDuplicates: true,
    });
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
