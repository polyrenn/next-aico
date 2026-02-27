CREATE INDEX IF NOT EXISTS "crbs_branch_id_timestamp_idx"
ON "crbs" ("branch_id", "timestamp");

CREATE INDEX IF NOT EXISTS "crbs_branch_id_timestamp_crb_number_idx"
ON "crbs" ("branch_id", "timestamp", "crb_number");

CREATE INDEX IF NOT EXISTS "crbs_branch_id_customer_id_amount_total_kg_timestamp_idx"
ON "crbs" ("branch_id", "customer_id", "amount", "total_kg", "timestamp");

CREATE INDEX IF NOT EXISTS "queue_branch_id_timestamp_idx"
ON "queue" ("branch_id", "timestamp");

CREATE INDEX IF NOT EXISTS "queue_branch_id_timestamp_crb_number_idx"
ON "queue" ("branch_id", "timestamp", "crb_number");

CREATE INDEX IF NOT EXISTS "sales_branch_id_timestamp_idx"
ON "sales" ("branch_id", "timestamp");

CREATE INDEX IF NOT EXISTS "sales_branch_id_timestamp_sale_number_idx"
ON "sales" ("branch_id", "timestamp", "sale_number");
