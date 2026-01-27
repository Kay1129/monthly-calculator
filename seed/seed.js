// server/seed/seed.js
const mongoose = require("mongoose");
const Expense = require("../models/Expense");

mongoose.connect("mongodb://localhost:27017/monthly-calculator");

async function seed() {
  console.log("🌱 Seeding expenses...");

  await Expense.deleteMany();

  await Expense.insertMany([
    {
      payer: "Kai",
      price: mongoose.Types.Decimal128.fromString("1200.00"),
      location: "Paknsave",
      description: "weekly food",
      regDate: "2026-January"
    },
    {
      payer: "Alex",
      price: mongoose.Types.Decimal128.fromString("320.50"),
      location: "Countdown",
      description: "Groceries for the week",
      regDate: "2026-January"
    },
    {
      payer: "Kai",
      price: mongoose.Types.Decimal128.fromString("180.20"),
      location: "Costco",
      description: "food",
      regDate: "2026-February"
    },
    {
      payer: "Alex",
      price: mongoose.Types.Decimal128.fromString("85.00"),
      location: "Taiping",
      description: "meat",
      regDate: "2026-February"
    },    {
      payer: "Alex",
      price: mongoose.Types.Decimal128.fromString("500.13"),
      location: "Countdown",
      description: "Monthly food",
      regDate: "2026-March"
    },
    {
      payer: "Kai",
      price: mongoose.Types.Decimal128.fromString("20.00"),
      location: "Taiping",
      description: "drinks",
      regDate: "2026-March"
    }
  ]);

  console.log("✅ Expense seed completed");
  process.exit();
}

seed();
