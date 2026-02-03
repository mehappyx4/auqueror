
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const config = await prisma.siteConfig.findUnique({
        where: { key: "hero_image" }
    });
    console.log("Hero Image Value:", config);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
