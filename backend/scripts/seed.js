import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Settings from "../models/Settings.js";

dotenv.config();

const categories = [
  {
    id: 1,
    name: "Beauty Care",
    description: "Premium collection of skincare, hair care, and cosmetics.",
    icon: "fas fa-spa",
    subCategories: ["Skincare", "Hair Care", "Cosmetics"]
  },
  {
    id: 2,
    name: "Sports Nutrition",
    description: "Fuel your performance with high-quality protein and supplements.",
    icon: "fas fa-dumbbell",
    subCategories: ["Protein Powder", "Energy Drinks", "Supplements"]
  },
  {
    id: 3,
    name: "Nutrition Supplements",
    description: "Fuel your body with premium supplements, vitamins, and minerals.",
    icon: "fas fa-capsules",
    subCategories: ["Vitamins", "Supplements", "Mineral Boosters"]
  },
  {
    id: 4,
    name: "Home Healthcare",
    description: "Essential home health devices and wellness products.",
    icon: "fas fa-heartbeat",
    subCategories: ["Glucose Meter", "Stomach Care", "First Aid", "Medical Devices"]
  },
  {
    id: 5,
    name: "Personal Care",
    description: "Daily hygiene and personal care essentials for the whole family.",
    icon: "fas fa-pump-soap",
    subCategories: ["Oral Care", "Body Wash", "Deodorants", "Cough Remedies", "Cold Relief"]
  },
  {
    id: 6,
    name: "Mother & Baby Care",
    description: "Gentle baby products and essential mother care products.",
    icon: "fas fa-baby",
    subCategories: ["Baby Wash", "Diapers", "Baby Nutrition"]
  },
  {
    id: 7,
    name: "Medicines",
    description: "Prescription and over-the-counter daily medicines.",
    icon: "fas fa-pills",
    subCategories: ["Pain Relief", "Fever Relief", "Antibiotics", "Nasal Care"]
  }
];

const products = [
  {
    id: 1,
    name: "Betadine Mouthwash And Gargle 250 Ml",
    brand: "Mundipharma",
    category: "Personal Care",
    subCategory: "Oral Care",
    price: 49.6,
    image: "/images/product1.webp",
    productRelated: [2, 3, 5, 6],
    generics: "Povidone-Iodine",
    usedFor: "Sore Throat & Oral Infections",
    howItWorks: "It acts as an antiseptic that kills sensitive organisms like bacteria and fungi.",
    precautions: "Do not use if you have thyroid disorders. Avoid contact with eyes.",
    sideEffects: "Local irritation, skin rash, or redness in the mouth.",
    description: "Betadine Mouthwash and Gargle is an antiseptic solution used to treat sore throat and oral infections.",
    isBestForLess: true
  },
  {
    id: 2,
    name: "Panadol Extra 500mg",
    brand: "GSK Consumer Healthcare",
    category: "Personal Care",
    subCategory: "Pain Relief",
    price: 30.0,
    image: "/images/product2.webp",
    productRelated: [3, 1, 4, 5],
    generics: "Paracetamol & Caffeine",
    usedFor: "Headache, Migraine & Fever",
    howItWorks: "Paracetamol blocks pain, while caffeine boosts its pain-relieving effect.",
    precautions: "Do not exceed 8 tablets in 24 hours. Avoid excessive caffeine intake.",
    sideEffects: "Insomnia, nervousness, or mild stomach upset.",
    description: "Effective relief for tough pain while being gentle on the stomach.",
    isPopular: true
  },
  {
    id: 3,
    name: "Brufen 400mg Tablets",
    brand: "Abbott Laboratories (Pak) Ltd",
    category: "Sports Nutrition",
    subCategory: "Supplements",
    price: 45.0,
    image: "/images/product3.webp",
    productRelated: [2, 1, 4, 5],
    generics: "Ibuprofen",
    usedFor: "Inflammation & Body Pain",
    howItWorks: "It works by blocking the production of natural substances that cause inflammation.",
    precautions: "Take with food to avoid stomach irritation. Not recommended for asthma patients.",
    sideEffects: "Nausea, heartburn, stomach pain, or dizziness.",
    description: "Commonly used for muscle pain, dental pain, and menstrual cramps.",
    isPopular: true
  },
  {
    id: 4,
    name: "Otrivin Nasal Spray",
    brand: "Haleon",
    category: "Personal Care",
    subCategory: "Cold Relief",
    price: 55.0,
    image: "/images/product4.webp",
    productRelated: [5, 6, 2, 3],
    generics: "Xylometazoline Hydrochloride",
    usedFor: "Nasal Congestion",
    howItWorks: "Narrows the blood vessels in the nose to reduce swelling and congestion.",
    precautions: "Do not use for more than 7 days. Can cause rebound congestion if overused.",
    sideEffects: "Dryness of the nose, sneezing, or temporary stinging.",
    description: "Fast-acting relief from nasal congestion caused by colds or hay fever.",
    isBestForLess: true
  },
  {
    id: 5,
    name: "Mucosolvan Syrup 100ml",
    brand: "Sanofi",
    category: "Personal Care",
    subCategory: "Cough Remedies",
    price: 22.5,
    image: "/images/mucosolvan.jpg",
    productRelated: [1, 6, 4, 2],
    generics: "Ambroxol Hydrochloride",
    usedFor: "Chest Congestion / Productive Cough",
    howItWorks: "Thins the mucus in the airways so it can be coughed out more easily.",
    precautions: "Consult a doctor if you have a history of stomach ulcers.",
    sideEffects: "Mild gastrointestinal disturbances or allergic reactions.",
    description: "Provides relief from chesty coughs by clearing thick phlegm.",
    isBestForLess: true
  },
  {
    id: 6,
    name: "Strepsils Honey & Lemon",
    brand: "Reckitt",
    category: "Personal Care",
    subCategory: "Oral Care",
    price: 15.0,
    image: "/images/strepsils.png",
    productRelated: [1, 5, 4, 2],
    generics: "2,4-Dichlorobenzyl alcohol",
    usedFor: "Sore Throat Relief",
    howItWorks: "Contains antiseptics that help kill the bacteria associated with mouth and throat infections.",
    precautions: "Not suitable for children under 6 years of age.",
    sideEffects: "Rarely, tongue soreness or allergic reactions.",
    description: "Soothing effective relief for sore throats.",
    isBestForLess: true
  },
  {
    id: 7,
    name: "Zyrtec 10mg Tablets",
    brand: "UCB",
    category: "Medicines",
    subCategory: "Pain Relief",
    price: 45.0,
    image: "/images/product7.webp",
    productRelated: [8, 4, 2, 3],
    generics: "Cetirizine Hydrochloride",
    usedFor: "Allergy Relief",
    howItWorks: "Blocks histamine to reduce allergy symptoms like sneezing, runny nose, and itchy eyes.",
    precautions: "May cause drowsiness. Avoid driving if affected.",
    sideEffects: "Drowsiness, dry mouth, or fatigue.",
    description: "Fast-acting antihistamine for 24-hour allergy relief.",
    isPopular: true
  },
  {
    id: 8,
    name: "Claritin 10mg Tablets",
    brand: "Bayer",
    category: "Medicines",
    subCategory: "Pain Relief",
    price: 35.0,
    image: "/images/product8.webp",
    productRelated: [7, 4, 2, 3],
    generics: "Loratadine",
    usedFor: "Allergy Symptoms",
    howItWorks: "Non-drowsy antihistamine that blocks histamine receptors to relieve allergy symptoms.",
    precautions: "Consult doctor if you have liver or kidney disease.",
    sideEffects: "Headache, dry mouth, or fatigue (rare).",
    description: "Fast 24-hour non-drowsy relief from allergy symptoms.",
    isPopular: true
  },
  {
    id: 9,
    name: "Pampers Premium Care Size 3 (60 Pcs)",
    brand: "Procter & Gamble",
    category: "Mother & Baby Care",
    subCategory: "Diapers",
    price: 290.0,
    image: "/images/pampers.jpg",
    productRelated: [10, 1, 2],
    generics: "Absorbent Polymer",
    usedFor: "Baby Dryness & Skin Care",
    howItWorks: "Absorbs wetness instantly to keep baby skin dry and free of diaper rash.",
    precautions: "Change diapers frequently to prevent rash. Dispose of responsibly.",
    sideEffects: "None under normal and hygienic diaper use.",
    description: "Premium diapers with soft cotton-like texture and wetness indicator.",
    isPopular: true
  },
  {
    id: 10,
    name: "Johnson's Baby Gold Shampoo 500ml",
    brand: "Johnson & Johnson",
    category: "Mother & Baby Care",
    subCategory: "Baby Wash",
    price: 85.0,
    image: "/images/johnsons.jpg",
    productRelated: [9, 1, 2],
    generics: "No More Tears Formula",
    usedFor: "Baby Hair Cleansing",
    howItWorks: "Gently cleanses baby's fine hair and delicate scalp without irritating the eyes.",
    precautions: "Keep out of reach of children to avoid accidental ingestion.",
    sideEffects: "None. Clinically proven mildness.",
    description: "Specially formulated baby shampoo that is as gentle to the eyes as pure water.",
    isPopular: true
  },
  {
    id: 11,
    name: "BioSil Collagen Generator",
    brand: "BioSil",
    category: "Beauty Care",
    subCategory: "Skincare",
    price: 1200.0,
    image: "/images/biosil.png",
    productRelated: [15, 22, 9, 10],
    generics: "ch-OSA (Choline-Stabilized Orthosilicic Acid)",
    usedFor: "Hair, skin, nails and bone health",
    howItWorks: "It activates the enzymes that generate collagen, keratin, and elastin in your body naturally.",
    precautions: "Consult your healthcare professional before use if you have any pre-existing medical conditions or are pregnant.",
    sideEffects: "None known when taken as directed.",
    description: "BioSil is a clinically proven collagen generator that helps protect and restore your body's three beauty proteins.",
    isPopular: true
  },
  {
    id: 12,
    name: "Braun Forehead Thermometer",
    brand: "Braun",
    category: "Home Healthcare",
    subCategory: "Medical Devices",
    price: 4800.0,
    image: "/images/braun_thermometer.png",
    productRelated: [18, 20, 5, 4],
    generics: "Infrared Sensor Technology",
    usedFor: "Body Temperature Measurement",
    howItWorks: "Uses an infrared sensor to capture the heat naturally emitted by the forehead in seconds.",
    precautions: "Ensure sensor lens is clean before measurement. Keep out of direct sunlight.",
    sideEffects: "None.",
    description: "Braun Forehead Thermometer provides fast, gentle, and accurate temperature readings for the whole family.",
    isPopular: true
  },
  {
    id: 13,
    name: "Cellucor C4 Pre-Workout",
    brand: "Cellucor",
    category: "Sports Nutrition",
    subCategory: "Supplements",
    price: 1650.0,
    image: "/images/c4_preworkout.png",
    productRelated: [19, 21, 3, 14],
    generics: "Beta-Alanine, Creatine, Caffeine & Citrulline Malate",
    usedFor: "Pre-Workout Energy & Performance Boost",
    howItWorks: "Increases muscle endurance, provides explosive energy, and enhances blood flow for optimal workout performance.",
    precautions: "Do not exceed recommended daily dose. Not intended for use by persons under 18 or those sensitive to caffeine.",
    sideEffects: "Tingly sensation (beta-alanine), increased heart rate, or restlessness.",
    description: "Cellucor C4 is America's number 1 selling pre-workout, formulated to deliver energy, focus, and pumps.",
    isBestForLess: true
  },
  {
    id: 14,
    name: "Centrum Adult Multivitamin",
    brand: "Centrum",
    category: "Nutrition Supplements",
    subCategory: "Vitamins",
    price: 850.0,
    image: "/images/centrum_multivitamin.png",
    productRelated: [16, 17, 21, 13],
    generics: "Multivitamins & Minerals",
    usedFor: "Daily nutritional support, energy, and immunity",
    howItWorks: "Fills nutritional gaps in the daily diet, supporting energy release, immune function, and bone health.",
    precautions: "Do not take on an empty stomach to prevent nausea. Keep out of reach of children.",
    sideEffects: "Mild stomach upset, constipation, or dark stools (due to iron).",
    description: "Centrum Adult Multivitamin is a complete daily supplement packed with essential nutrients to support overall health.",
    isPopular: true
  },
  {
    id: 15,
    name: "Nature's Bounty Hair, Skin & Nails",
    brand: "Nature's Bounty",
    category: "Beauty Care",
    subCategory: "Skincare",
    price: 1450.0,
    image: "/images/natures_bounty_hair_skin_nails.png",
    productRelated: [11, 22, 9, 10],
    generics: "Biotin, Vitamins C & E",
    usedFor: "Healthy hair, glowing skin, and strong nails",
    howItWorks: "Supplies essential nutrients to support the structural foundation of hair, skin, and nails.",
    precautions: "Consult your doctor if you are pregnant, nursing, taking any medications, or planning any medical procedure.",
    sideEffects: "Rarely, mild stomach discomfort or skin rash.",
    description: "Formulated with Biotin and antioxidants to support beauty from within, promoting vibrant hair, skin, and nails.",
    isPopular: true
  },
  {
    id: 16,
    name: "Nature's Bounty Vitamin D3",
    brand: "Nature's Bounty",
    category: "Nutrition Supplements",
    subCategory: "Vitamins",
    price: 1200.0,
    image: "/images/natures_bounty_vit_d3.png",
    productRelated: [14, 17, 21, 13],
    generics: "Cholecalciferol (Vitamin D3)",
    usedFor: "Immune support and bone health",
    howItWorks: "Enhances calcium absorption in the intestines and maintains adequate serum calcium and phosphate concentrations.",
    precautions: "Consult your doctor if you have hypercalcemia or kidney disease.",
    sideEffects: "Generally well tolerated. Excess intake can cause high calcium levels.",
    description: "Nature's Bounty Vitamin D3 provides an easy way to get your daily dose of the sunshine vitamin to support healthy bones and immune function.",
    isBestForLess: true
  },
  {
    id: 17,
    name: "Nordic Naturals Omega-3 Fish Oil",
    brand: "Nordic Naturals",
    category: "Nutrition Supplements",
    subCategory: "Vitamins",
    price: 2800.0,
    image: "/images/nordic_naturals_omega3.png",
    productRelated: [14, 16, 21, 13],
    generics: "Purified Deep Sea Fish Oil (EPA & DHA)",
    usedFor: "Heart, brain, and joint health",
    howItWorks: "Incorporates into cell membranes to reduce inflammatory pathways and support cognitive function and cardiovascular health.",
    precautions: "Consult doctor if you are taking blood thinners or planning surgery.",
    sideEffects: "Fishy aftertaste, mild stomach upset, or loose stools.",
    description: "Nordic Naturals Omega-3 is a high-quality fish oil that meets strict international standards for purity and freshness.",
    isPopular: true
  },
  {
    id: 18,
    name: "Omron Blood Pressure Monitor",
    brand: "Omron",
    category: "Home Healthcare",
    subCategory: "Medical Devices",
    price: 3500.0,
    image: "/images/omron_bp_monitor.png",
    productRelated: [12, 20, 5, 4],
    generics: "Oscillometric Sensor Tech",
    usedFor: "Blood Pressure Monitoring",
    howItWorks: "Measures arterial blood pressure using the oscillometric method to detect movement of blood through the brachial artery.",
    precautions: "Avoid eating, drinking alcohol, or smoking 30 minutes before taking a measurement.",
    sideEffects: "None.",
    description: "Omron Blood Pressure Monitor offers accurate, comfortable, and easy-to-use blood pressure readings at home.",
    isPopular: true
  },
  {
    id: 19,
    name: "Optimum Nutrition Gold Standard Whey Protein",
    brand: "Optimum Nutrition",
    category: "Sports Nutrition",
    subCategory: "Protein Powder",
    price: 6400.0,
    image: "/images/on_whey_protein.png",
    productRelated: [13, 21, 3, 14],
    generics: "Whey Protein Isolate, Concentrate & Peptides",
    usedFor: "Muscle recovery and muscle building",
    howItWorks: "Provides high-quality fast-digesting amino acids to repair and rebuild muscle fibers after exercise.",
    precautions: "Contains milk and soy. Consult healthcare professional if you have kidney disease.",
    sideEffects: "Bloating or digestive discomfort in lactose-sensitive individuals.",
    description: "The world's best-selling whey protein powder, delivering 24g of high-quality protein per serving to support muscle growth.",
    isPopular: true
  },
  {
    id: 20,
    name: "Pulse Oximeter Fingertip",
    brand: "Generic",
    category: "Home Healthcare",
    subCategory: "Medical Devices",
    price: 650.0,
    image: "/images/pulse_oximeter.png",
    productRelated: [12, 18, 5, 4],
    generics: "Optical Sensor Technology",
    usedFor: "Oxygen Saturation (SpO2) & Pulse Rate Measurement",
    howItWorks: "Uses red and infrared light absorption to measure the percentage of hemoglobin loaded with oxygen.",
    precautions: "Ensure fingernail is clean and free of nail polish for accurate readings.",
    sideEffects: "None.",
    description: "A portable, fast, and accurate fingertip device to monitor oxygen saturation levels and pulse rate anywhere.",
    isBestForLess: true
  },
  {
    id: 21,
    name: "Thorne Creatine Monohydrate",
    brand: "Thorne",
    category: "Sports Nutrition",
    subCategory: "Supplements",
    price: 2400.0,
    image: "/images/thorne_creatine.png",
    productRelated: [13, 19, 3, 14],
    generics: "Pure Micronized Creatine Monohydrate",
    usedFor: "Muscle strength, cellular energy, and lean body mass",
    howItWorks: "Replenishes adenosine triphosphate (ATP) levels to increase short-term explosive power and muscle energy.",
    precautions: "Maintain adequate daily hydration. Not recommended for individuals with kidney disease.",
    sideEffects: "Weight gain (water retention), mild muscle cramping or bloating.",
    description: "Thorne Creatine offers pure, high-quality micronized creatine monohydrate to support physical performance and cognitive function.",
    isPopular: true
  },
  {
    id: 22,
    name: "Vital Proteins Collagen Peptides",
    brand: "Vital Proteins",
    category: "Beauty Care",
    subCategory: "Skincare",
    price: 2700.0,
    image: "/images/vital_proteins_collagen.png",
    productRelated: [11, 15, 9, 10],
    generics: "Bovine Collagen Peptides",
    usedFor: "Skin elasticity, hair thickness, and joint mobility",
    howItWorks: "Provides key amino acids that are key building blocks for new collagen synthesis in skin, hair, and joints.",
    precautions: "Consult your doctor if you have allergies to beef or are pregnant/breastfeeding.",
    sideEffects: "Rarely, mild digestive symptoms.",
    description: "Vital Proteins Collagen Peptides is a pasture-raised, grass-fed collagen powder that easily dissolves in hot or cold liquids.",
    isPopular: true
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Settings.deleteMany();

    console.log("Database cleared.");

    // Seed Categories
    await Category.insertMany(categories);
    console.log(`${categories.length} categories seeded.`);

    // Seed Products
    await Product.insertMany(products);
    console.log(`${products.length} products seeded.`);

    // Seed Settings
    const defaultSettings = new Settings({
      name: "SereneMeds Central Pharmacy",
      address: "12 El-Gish Street, Assiut, Egypt",
      phone: "021 344 1122",
      deliveryFee: 25,
      isOpen: true
    });
    await defaultSettings.save();
    console.log("Default settings seeded.");

    // Seed Users
    const defaultUser = new User({
      name: "User Medical Plus",
      email: "user@medicalplus.com",
      password: "password123",
      role: "user"
    });

    const defaultAdmin = new User({
      name: "Admin Medical Plus",
      email: "admin@medicalplus.com",
      password: "password123",
      role: "admin"
    });

    await defaultUser.save();
    await defaultAdmin.save();

    console.log("Default users seeded (user@medicalplus.com / admin@medicalplus.com)");

    console.log("Database successfully seeded!");
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
