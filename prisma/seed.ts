import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.expenseSplit.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.inviteToken.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create 3 users
  const password = await bcryptjs.hash("password123", 12);

  const alice = await prisma.user.create({
    data: {
      name: "Alice García",
      email: "alice@example.com",
      hashedPassword: password,
      currency: "EUR",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Martínez",
      email: "bob@example.com",
      hashedPassword: password,
      currency: "EUR",
    },
  });

  const carlos = await prisma.user.create({
    data: {
      name: "Carlos López",
      email: "carlos@example.com",
      hashedPassword: password,
      currency: "EUR",
    },
  });

  console.log("✅ Created 3 users");

  // Create 2 groups
  const groupVacaciones = await prisma.group.create({
    data: {
      name: "Vacaciones en Ibiza",
      description: "Gastos del viaje a Ibiza del verano",
      currency: "EUR",
      createdById: alice.id,
      members: {
        create: [
          { userId: alice.id, role: "admin" },
          { userId: bob.id, role: "member" },
          { userId: carlos.id, role: "member" },
        ],
      },
    },
  });

  const groupPiso = await prisma.group.create({
    data: {
      name: "Piso compartido",
      description: "Gastos mensuales del piso",
      currency: "EUR",
      createdById: bob.id,
      members: {
        create: [
          { userId: bob.id, role: "admin" },
          { userId: alice.id, role: "member" },
        ],
      },
    },
  });

  console.log("✅ Created 2 groups");

  // Create 8 expenses (5 in vacaciones, 3 in piso)
  // Expense 1: Alice pagó el hotel
  const hotel = await prisma.expense.create({
    data: {
      groupId: groupVacaciones.id,
      paidById: alice.id,
      title: "Hotel Ibiza",
      amount: 450,
      currency: "EUR",
      category: "accommodation",
      description: "3 noches en el hotel",
      date: new Date("2024-07-15"),
      splits: {
        create: [
          { userId: alice.id, amount: 150 },
          { userId: bob.id, amount: 150 },
          { userId: carlos.id, amount: 150 },
        ],
      },
    },
  });

  // Expense 2: Bob pagó la cena
  const cena = await prisma.expense.create({
    data: {
      groupId: groupVacaciones.id,
      paidById: bob.id,
      title: "Cena en Es Torrent",
      amount: 180,
      currency: "EUR",
      category: "food",
      date: new Date("2024-07-16"),
      splits: {
        create: [
          { userId: alice.id, amount: 60 },
          { userId: bob.id, amount: 60 },
          { userId: carlos.id, amount: 60 },
        ],
      },
    },
  });

  // Expense 3: Carlos pagó el barco
  await prisma.expense.create({
    data: {
      groupId: groupVacaciones.id,
      paidById: carlos.id,
      title: "Excursión en barco",
      amount: 240,
      currency: "EUR",
      category: "entertainment",
      date: new Date("2024-07-17"),
      splits: {
        create: [
          { userId: alice.id, amount: 80 },
          { userId: bob.id, amount: 80 },
          { userId: carlos.id, amount: 80 },
        ],
      },
    },
  });

  // Expense 4: Alice pagó supermercado
  await prisma.expense.create({
    data: {
      groupId: groupVacaciones.id,
      paidById: alice.id,
      title: "Supermercado",
      amount: 75,
      currency: "EUR",
      category: "food",
      date: new Date("2024-07-16"),
      splits: {
        create: [
          { userId: alice.id, amount: 25 },
          { userId: bob.id, amount: 25 },
          { userId: carlos.id, amount: 25 },
        ],
      },
    },
  });

  // Expense 5: Bob pagó transporte
  await prisma.expense.create({
    data: {
      groupId: groupVacaciones.id,
      paidById: bob.id,
      title: "Taxi aeropuerto",
      amount: 60,
      currency: "EUR",
      category: "transport",
      date: new Date("2024-07-14"),
      splits: {
        create: [
          { userId: alice.id, amount: 20 },
          { userId: bob.id, amount: 20 },
          { userId: carlos.id, amount: 20 },
        ],
      },
    },
  });

  // Expense 6: Bob pagó alquiler
  const alquiler = await prisma.expense.create({
    data: {
      groupId: groupPiso.id,
      paidById: bob.id,
      title: "Alquiler agosto",
      amount: 1200,
      currency: "EUR",
      category: "utilities",
      date: new Date("2024-08-01"),
      splits: {
        create: [
          { userId: bob.id, amount: 600 },
          { userId: alice.id, amount: 600 },
        ],
      },
    },
  });

  // Expense 7: Alice pagó internet
  await prisma.expense.create({
    data: {
      groupId: groupPiso.id,
      paidById: alice.id,
      title: "Internet y luz",
      amount: 80,
      currency: "EUR",
      category: "utilities",
      date: new Date("2024-08-05"),
      splits: {
        create: [
          { userId: alice.id, amount: 40 },
          { userId: bob.id, amount: 40 },
        ],
      },
    },
  });

  // Expense 8: Bob pagó compra supermercado
  await prisma.expense.create({
    data: {
      groupId: groupPiso.id,
      paidById: bob.id,
      title: "Compra semanal",
      amount: 95,
      currency: "EUR",
      category: "food",
      date: new Date("2024-08-10"),
      splits: {
        create: [
          { userId: bob.id, amount: 47.5 },
          { userId: alice.id, amount: 47.5 },
        ],
      },
    },
  });

  console.log("✅ Created 8 expenses");

  // Create 4 splits already settled (settlement records)
  const settlement1 = await prisma.settlement.create({
    data: {
      groupId: groupVacaciones.id,
      payerId: bob.id,
      receiverId: alice.id,
      amount: 50,
      currency: "EUR",
      note: "Pago parcial hotel",
      date: new Date("2024-07-20"),
    },
  });

  const settlement2 = await prisma.settlement.create({
    data: {
      groupId: groupVacaciones.id,
      payerId: carlos.id,
      receiverId: alice.id,
      amount: 100,
      currency: "EUR",
      note: "Parte del hotel y supermercado",
      date: new Date("2024-07-21"),
    },
  });

  await prisma.settlement.create({
    data: {
      groupId: groupPiso.id,
      payerId: alice.id,
      receiverId: bob.id,
      amount: 600,
      currency: "EUR",
      note: "Mi parte del alquiler",
      date: new Date("2024-08-02"),
    },
  });

  await prisma.settlement.create({
    data: {
      groupId: groupPiso.id,
      payerId: alice.id,
      receiverId: bob.id,
      amount: 47.5,
      currency: "EUR",
      note: "Compra semanal",
      date: new Date("2024-08-12"),
    },
  });

  console.log("✅ Created 4 settlements");

  // Add some comments
  await prisma.comment.create({
    data: {
      expenseId: hotel.id,
      userId: bob.id,
      content: "¡Qué hotel tan bueno! Muy bien ubicado.",
    },
  });

  await prisma.comment.create({
    data: {
      expenseId: cena.id,
      userId: alice.id,
      content: "La paella estaba increíble 🥘",
    },
  });

  await prisma.comment.create({
    data: {
      expenseId: cena.id,
      userId: carlos.id,
      content: "Totalmente de acuerdo, repetiría!",
    },
  });

  console.log("✅ Created comments");

  // Create welcome notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: alice.id,
        type: "welcome",
        title: "Bienvenida a Dividelo",
        message: "Crea o únete a un grupo para empezar a dividir gastos.",
      },
      {
        userId: bob.id,
        type: "welcome",
        title: "Bienvenido a Dividelo",
        message: "Crea o únete a un grupo para empezar a dividir gastos.",
      },
      {
        userId: carlos.id,
        type: "welcome",
        title: "Bienvenido a Dividelo",
        message: "Crea o únete a un grupo para empezar a dividir gastos.",
      },
    ],
  });

  console.log("✅ Created notifications");

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📧 Test credentials (password: password123):");
  console.log("   alice@example.com");
  console.log("   bob@example.com");
  console.log("   carlos@example.com");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
