
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const config = await prisma.siteConfig.update({
        where: { key: "hero_image" },
        data: { value: "" }
    });
    console.log("Reset Hero Image to empty:", config);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
