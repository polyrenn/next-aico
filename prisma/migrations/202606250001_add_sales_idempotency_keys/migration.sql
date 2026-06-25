ALTER TABLE "crbs"
ADD COLUMN "idempotency_key" TEXT;

ALTER TABLE "sales"
ADD COLUMN "idempotency_key" TEXT;

CREATE UNIQUE INDEX "crbs_branch_id_idempotency_key_key"
ON "crbs" ("branch_id", "idempotency_key");

CREATE UNIQUE INDEX "sales_branch_id_idempotency_key_key"
ON "sales" ("branch_id", "idempotency_key");
