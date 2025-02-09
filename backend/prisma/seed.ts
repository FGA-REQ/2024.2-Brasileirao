import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION update_rental_status() RETURNS TRIGGER AS $$
    BEGIN
      IF NEW."startDate" > NOW() THEN
        NEW."status" := 'PENDING';
      ELSIF NEW."startDate" <= NOW() AND NEW."endDate" >= NOW() THEN
        NEW."status" := 'ACTIVE';
      ELSIF NEW."endDate" < NOW() THEN
        NEW."status" := 'FINISHED';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE TRIGGER rental_status_trigger
    BEFORE INSERT OR UPDATE ON "Rental"
    FOR EACH ROW
    EXECUTE FUNCTION update_rental_status();
  `)

  console.log("Trigger function created successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
