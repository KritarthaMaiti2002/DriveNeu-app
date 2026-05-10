import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("driver123", 10);
  const user = await prisma.user.upsert({
    where: { email: "chandan@driveneu.test" },
    update: {},
    create: {
      email: "chandan@driveneu.test",
      passwordHash,
      name: "Chandan Mishra",
      driver: {
        create: {
          partnerId: "68890",
          tier: "Gold Partner",
          status: "ONLINE",
          rating: 4.92,
          streakDays: 12,
          wallet: { create: { balance: 1450 } },
        },
      },
    },
    include: { driver: { include: { wallet: true } } },
  });

  const driver = user.driver!;
  await prisma.booking.create({
    data: {
      driverId: driver.id,
      passenger: "Amit Sharma",
      pickup: "Terminal 2, Chhatrapati Shivaji Airport",
      dropoff: "Taj Lands End, Bandra West",
      scheduledAt: new Date(Date.now() + 3600_000),
      fare: 482.5,
      distanceKm: 12.4,
    },
  });

  await prisma.fAQ.createMany({
    data: [
      { category: "earnings", question: "When do I get paid?", answer: "Payouts happen daily at 11pm." },
      { category: "safety", question: "What if I feel unsafe?", answer: "Hit the SOS button in-app." },
      { category: "account", question: "How to update KYC?", answer: "Profile → KYC → upload docs." },
    ],
  });

  console.log("Seeded.");
}

main().finally(() => prisma.$disconnect());
