import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const producedMaterials = [
        {id: "P1", name: "Children's bicycle", itemValue: 156.13},
        {id: "P2", name: "Ladies bicycle", itemValue: 163.33},
        {id: "P3", name: "Men's bicycle", itemValue: 165.08},
        {id: "E4", name: "Rear wheel group", itemValue: 40.85},
        {id: "E5", name: "Rear wheel group", itemValue: 39.85},
        {id: "E6", name: "Rear wheel group", itemValue: 40.85},
        {id: "E7", name: "Front wheel group", itemValue: 35.85},
        {id: "E8", name: "Front wheel group", itemValue: 35.85},
        {id: "E9", name: "Front wheel group", itemValue: 35.85},
        {id: "E10", name: "Mudguard rear", itemValue: 12.40},
        {id: "E11", name: "Mudguard rear", itemValue: 14.65},
        {id: "E12", name: "Mudguard rear", itemValue: 14.65},
        {id: "E13", name: "Mudguard front", itemValue: 12.40},
        {id: "E14", name: "Mudguard front", itemValue: 14.65},
        {id: "E15", name: "Mudguard front", itemValue: 14.65},
        {id: "E16", name: "Handle compete", itemValue: 7.02, defaultStock: 300},
        {id: "E17", name: "Saddle complete", itemValue: 7.16, defaultStock: 300},
        {id: "E18", name: "Frame", itemValue: 13.15},
        {id: "E19", name: "Frame", itemValue: 14.35},
        {id: "E20", name: "Frame", itemValue: 15.55},
        {id: "E26", name: "Pedal complete", itemValue: 10.50, defaultStock: 300},
        {id: "E29", name: "Front wheel compl.", itemValue: 69.29},
        {id: "E30", name: "Frame and wheels", itemValue: 127.53},
        {id: "E31", name: "Bicycle w/o pedals", itemValue: 144.42},
        {id: "E49", name: "Front wheel compl.", itemValue: 64.64},
        {id: "E50", name: "Frame and wheels", itemValue: 120.63},
        {id: "E51", name: "Bicycle w/o pedals", itemValue: 137.47},
        {id: "E54", name: "Front wheel compl.", itemValue: 68.09},
        {id: "E55", name: "Frame and wheels", itemValue: 125.33},
        {id: "E56", name: "Bicycle w/o pedals", itemValue: 142.67},
    ];

    const purchasedMaterials = [
        {id: "K21", name: "Chain", itemValue: 5.00, defaultStock: 300},
        {id: "K22", name: "Chain", itemValue: 6.50, defaultStock: 300},
        {id: "K23", name: "Chain", itemValue: 6.50, defaultStock: 300},
        {id: "K24", name: "Nut 3/8\"", itemValue: 0.06, defaultStock: 6100},
        {id: "K25", name: "Washer 3/8\"", itemValue: 0.06, defaultStock: 3600},
        {id: "K27", name: "Screw 3/8\"", itemValue: 0.10, defaultStock: 1800},
        {id: "K28", name: "Tube 3/4\"", itemValue: 1.20, defaultStock: 4500},
        {id: "K32", name: "Paint", itemValue: 0.75, defaultStock: 2700},
        {id: "K33", name: "Rim compl.", itemValue: 22.00, defaultStock: 900},
        {id: "K34", name: "Spoke", itemValue: 0.10, defaultStock: 22000},
        {id: "K35", name: "Taper sleeve", itemValue: 1.00, defaultStock: 3600},
        {id: "K36", name: "Free wheel", itemValue: 8.00, defaultStock: 100},
        {id: "K37", name: "Fork", itemValue: 1.50, defaultStock: 900},
        {id: "K38", name: "Axle", itemValue: 1.50, defaultStock: 300},
        {id: "K39", name: "Sheet", itemValue: 1.50, defaultStock: 900},
        {id: "K40", name: "Handle bar", itemValue: 2.50, defaultStock: 900},
        {id: "K41", name: "Nut 3/4\"", itemValue: 0.06, defaultStock: 900},
        {id: "K42", name: "Handle grip", itemValue: 0.10, defaultStock: 1800},
        {id: "K43", name: "Saddle", itemValue: 5.00, defaultStock: 2700},
        {id: "K44", name: "Bar 1/2\"", itemValue: 0.50, defaultStock: 2700},
        {id: "K45", name: "Nut 1/4\"", itemValue: 0.06, defaultStock: 900},
        {id: "K46", name: "Screw 1/4\"", itemValue: 0.10, defaultStock: 900},
        {id: "K47", name: "Sprocket", itemValue: 3.50, defaultStock: 900},
        {id: "K48", name: "Pedal", itemValue: 1.50, defaultStock: 1800},
        {id: "K52", name: "Rim compl.", itemValue: 22.00, defaultStock: 600},
        {id: "K53", name: "Spoke", itemValue: 0.10, defaultStock: 22000},
        {id: "K57", name: "Rim compl.", itemValue: 22.00, defaultStock: 600},
        {id: "K58", name: "Spoke", itemValue: 0.10, defaultStock: 22000},
        {id: "K59", name: "Welding wires", itemValue: 0.15, defaultStock: 1800},
    ];

    await prisma.material.createMany({
        data: producedMaterials.concat(purchasedMaterials),
    });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })