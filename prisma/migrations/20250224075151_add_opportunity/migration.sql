-- CreateTable
CREATE TABLE "Opportunity" (
    "id" SERIAL NOT NULL,
    "opp_name" TEXT NOT NULL,
    "opp_description" TEXT,
    "opp_start_date" TIMESTAMP(3) NOT NULL,
    "opp_end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);
