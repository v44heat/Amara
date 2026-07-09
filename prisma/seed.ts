import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Amara Hotel & Residences...");

  const passwordHash = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@amarahotel.co.ke" },
    update: {},
    create: {
      firstName: "Amina",
      lastName: "Njoroge",
      email: "admin@amarahotel.co.ke",
      phone: "0711000001",
      passwordHash,
      role: "ADMINISTRATOR",
      isEmailVerified: true,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@amarahotel.co.ke" },
    update: {},
    create: {
      firstName: "Brian",
      lastName: "Otieno",
      email: "manager@amarahotel.co.ke",
      phone: "0711000002",
      passwordHash,
      role: "MANAGER",
      isEmailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "guest@example.com" },
    update: {},
    create: {
      firstName: "Wanjiru",
      lastName: "Kamau",
      email: "guest@example.com",
      phone: "0711000003",
      passwordHash,
      role: "GUEST",
      isEmailVerified: true,
    },
  });

  const frontOffice = await prisma.department.upsert({
    where: { name: "Front Office" },
    update: {},
    create: { name: "Front Office", description: "Reception, reservations and guest relations" },
  });

  const housekeeping = await prisma.department.upsert({
    where: { name: "Housekeeping" },
    update: {},
    create: { name: "Housekeeping", description: "Room cleaning, turndown and maintenance requests" },
  });

  await Promise.all(
    ["Food & Beverage", "Maintenance", "Sales & Events"].map((name) =>
      prisma.department.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  await prisma.staff.upsert({
    where: { userId: manager.id },
    update: {},
    create: { userId: manager.id, departmentId: frontOffice.id, position: "General Manager" },
  });

  const housekeeper = await prisma.user.upsert({
    where: { email: "housekeeping@amarahotel.co.ke" },
    update: {},
    create: {
      firstName: "Grace",
      lastName: "Wambui",
      email: "housekeeping@amarahotel.co.ke",
      phone: "0711000004",
      passwordHash,
      role: "RECEPTIONIST", // system access level; job function is set via Staff.department below
      isEmailVerified: true,
    },
  });

  await prisma.staff.upsert({
    where: { userId: housekeeper.id },
    update: {},
    create: { userId: housekeeper.id, departmentId: housekeeping.id, position: "Housekeeping Attendant" },
  });

  const hotel = await prisma.hotel.create({
    data: {
      name: "Amara Hotel & Residences",
      description:
        "A five-star residence on the Karen hills, blending East African craft with modern luxury.",
      address: "Karen Road",
      city: "Nairobi",
      country: "Kenya",
      latitude: -1.3197,
      longitude: 36.7076,
      phone: "+254700123456",
      email: "reservations@amarahotel.co.ke",
      starRating: 5,
      amenities: ["Free Wi-Fi", "Airport shuttle", "24-hour front desk", "Spa", "Pool", "Conference rooms"],
      images: [],
    },
  });

  const amenityNames = [
    "Free Wi-Fi", "Air conditioning", "Mini bar", "Rain shower", "Private balcony",
    "Smart TV", "Coffee machine", "Safe box", "Bathtub", "Garden view",
  ];
  const amenities = await Promise.all(
    amenityNames.map((name) => prisma.amenity.upsert({ where: { name }, update: {}, create: { name } }))
  );

  const roomTypeDefs = [
    {
      name: "Hillview Deluxe Room",
      description: "Floor-to-ceiling views over the Ngong hills with a private balcony.",
      basePrice: 12900,
      maxAdults: 2,
      maxChildren: 1,
      sizeSqm: 32,
      bedType: "Queen",
      numBeds: 1,
      count: 6,
      priceStep: 400,
    },
    {
      name: "Karen Garden Suite",
      description: "A private garden terrace facing the acacia grove.",
      basePrice: 18500,
      maxAdults: 2,
      maxChildren: 2,
      sizeSqm: 42,
      bedType: "King",
      numBeds: 1,
      count: 5,
      priceStep: 500,
    },
    {
      name: "Acacia Family Room",
      description: "Connecting spaces designed for families, with two twin beds for the kids.",
      basePrice: 16800,
      maxAdults: 2,
      maxChildren: 3,
      sizeSqm: 48,
      bedType: "King + Twin",
      numBeds: 3,
      count: 4,
      priceStep: 300,
    },
    {
      name: "Amara Residence",
      description: "A full residence with a private plunge pool and living area.",
      basePrice: 34000,
      maxAdults: 4,
      maxChildren: 2,
      sizeSqm: 78,
      bedType: "2 King Beds",
      numBeds: 2,
      count: 3,
      priceStep: 1000,
    },
  ];

  let floor = 1;
  for (const def of roomTypeDefs) {
    const roomType = await prisma.roomType.create({
      data: {
        hotelId: hotel.id,
        name: def.name,
        description: def.description,
        basePrice: def.basePrice,
        maxAdults: def.maxAdults,
        maxChildren: def.maxChildren,
        sizeSqm: def.sizeSqm,
        bedType: def.bedType,
        numBeds: def.numBeds,
        images: [],
        amenities: {
          create: amenities
            .slice(0, 6 + Math.floor(Math.random() * 4))
            .map((a) => ({ amenityId: a.id })),
        },
      },
    });

    for (let i = 0; i < def.count; i++) {
      await prisma.room.create({
        data: {
          hotelId: hotel.id,
          roomTypeId: roomType.id,
          roomNumber: `${floor}0${i + 1}`,
          floor,
          pricePerNight: def.basePrice + i * def.priceStep,
          images: [],
        },
      });
    }
    floor++;
  }

  await prisma.promoCode.create({
    data: {
      hotelId: hotel.id,
      code: "AMARA10",
      description: "10% off your stay",
      discountType: "PERCENTAGE",
      discountValue: 10,
      maxUses: 100,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    },
  });

  await prisma.menuItem.createMany({
    data: [
      { name: "Swahili Coconut Fish Curry", price: 2200, category: "Mains" },
      { name: "Nyama Choma Platter", price: 2600, category: "Mains" },
      { name: "Sukuma Wiki & Ugali", price: 900, category: "Sides" },
      { name: "Tropical Fruit Bowl", price: 750, category: "Breakfast" },
      { name: "Amara Iced Coffee", price: 550, category: "Beverages" },
    ],
  });

  console.log("Seed complete.");
  console.log("Login as admin: admin@amarahotel.co.ke / Password123!");
  console.log("Login as manager: manager@amarahotel.co.ke / Password123!");
  console.log("Login as housekeeping staff: housekeeping@amarahotel.co.ke / Password123!");
  console.log("Login as guest: guest@example.com / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
