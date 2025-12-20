-- CreateTable
CREATE TABLE "Absence" (
    "id" SERIAL NOT NULL,
    "studentMatricule" TEXT NOT NULL,
    "matiere" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "justification" TEXT,
    "type" TEXT NOT NULL,

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_studentMatricule_fkey" FOREIGN KEY ("studentMatricule") REFERENCES "Student"("matricule") ON DELETE RESTRICT ON UPDATE CASCADE;
