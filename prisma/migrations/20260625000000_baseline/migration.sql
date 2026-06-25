-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "name" TEXT,
    "address" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "current_tank" TEXT,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("branch_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "price_per_kg" INTEGER NOT NULL,
    "available_kgs" DOUBLE PRECISION[] DEFAULT ARRAY[1, 2, 3]::DOUBLE PRECISION[],

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(12) NOT NULL,
    "customer_type" TEXT,
    "date" TIMESTAMPTZ NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "change" INTEGER NOT NULL DEFAULT 0,
    "purchase_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crbs" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "crb_number" INTEGER NOT NULL DEFAULT 0,
    "customer_id" TEXT,
    "description" JSONB NOT NULL,
    "amount" INTEGER NOT NULL,
    "total_kg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "date" DATE,

    CONSTRAINT "crbs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queue" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "crb_number" INTEGER NOT NULL,
    "customer_id" TEXT,
    "description" JSONB NOT NULL,
    "amount" INTEGER NOT NULL,
    "total_kg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "date" DATE,

    CONSTRAINT "queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "sale_number" INTEGER NOT NULL DEFAULT 3,
    "total_kg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amount" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "date" DATE,
    "customer_id" TEXT NOT NULL,
    "description" JSONB NOT NULL,
    "narrative" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "change" DOUBLE PRECISION NOT NULL,
    "current_tank" TEXT NOT NULL,
    "opening" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "closing" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tanks" (
    "id" SERIAL NOT NULL,
    "tank_id" TEXT NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "tanks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "load_number" INTEGER NOT NULL,
    "tank_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "kg" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staffs" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declined_sales" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "sale_number" INTEGER NOT NULL DEFAULT 3,
    "total_kg" INTEGER NOT NULL DEFAULT 0,
    "amount" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "customer_id" TEXT NOT NULL,
    "description" JSONB NOT NULL,
    "decline_reason" TEXT NOT NULL,

    CONSTRAINT "declined_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "switch_log" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "meta" JSONB NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "switch_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "staffId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_unique_id_key" ON "customers"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE INDEX "crbs_branch_id_timestamp_idx" ON "crbs"("branch_id", "timestamp");

-- CreateIndex
CREATE INDEX "crbs_branch_id_timestamp_crb_number_idx" ON "crbs"("branch_id", "timestamp", "crb_number");

-- CreateIndex
CREATE INDEX "crbs_branch_id_customer_id_amount_total_kg_timestamp_idx" ON "crbs"("branch_id", "customer_id", "amount", "total_kg", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "crbs_crb_number_branch_id_date_key" ON "crbs"("crb_number", "branch_id", "date");

-- CreateIndex
CREATE INDEX "queue_branch_id_timestamp_idx" ON "queue"("branch_id", "timestamp");

-- CreateIndex
CREATE INDEX "queue_branch_id_timestamp_crb_number_idx" ON "queue"("branch_id", "timestamp", "crb_number");

-- CreateIndex
CREATE UNIQUE INDEX "queue_crb_number_branch_id_date_key" ON "queue"("crb_number", "branch_id", "date");

-- CreateIndex
CREATE INDEX "sales_branch_id_timestamp_idx" ON "sales"("branch_id", "timestamp");

-- CreateIndex
CREATE INDEX "sales_branch_id_timestamp_sale_number_idx" ON "sales"("branch_id", "timestamp", "sale_number");

-- CreateIndex
CREATE UNIQUE INDEX "sales_sale_number_branch_id_date_key" ON "sales"("sale_number", "branch_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "tanks_tank_id_key" ON "tanks"("tank_id");

-- CreateIndex
CREATE UNIQUE INDEX "staffs_username_key" ON "staffs"("username");

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crbs" ADD CONSTRAINT "crbs_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queue" ADD CONSTRAINT "queue_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tanks" ADD CONSTRAINT "tanks_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "tanks"("tank_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declined_sales" ADD CONSTRAINT "declined_sales_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "switch_log" ADD CONSTRAINT "switch_log_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

