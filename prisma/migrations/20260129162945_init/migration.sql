-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uf" TEXT,
    "municipio" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CndType" (
    "id" TEXT NOT NULL,
    "uf" TEXT,
    "municipio" TEXT,
    "tipo" TEXT NOT NULL,
    "instructions" JSONB NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CndType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FornecedorCnd" (
    "id" TEXT NOT NULL,
    "fornecedorid" TEXT NOT NULL,
    "cndtypeid" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "validade" DATE NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FornecedorCnd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cnpj_key" ON "Fornecedor"("cnpj");

-- AddForeignKey
ALTER TABLE "FornecedorCnd" ADD CONSTRAINT "FornecedorCnd_fornecedorid_fkey" FOREIGN KEY ("fornecedorid") REFERENCES "Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FornecedorCnd" ADD CONSTRAINT "FornecedorCnd_cndtypeid_fkey" FOREIGN KEY ("cndtypeid") REFERENCES "CndType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
