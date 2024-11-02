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

    const materialRequirements = [
        // BOM for P1
        {materialId: "P1", requiredMaterialId: "K21", sum: 1},
        {materialId: "P1", requiredMaterialId: "K24", sum: 1},
        {materialId: "P1", requiredMaterialId: "K27", sum: 1},
        {materialId: "P1", requiredMaterialId: "E26", sum: 1},
        {materialId: "P1", requiredMaterialId: "E51", sum: 1},

        {materialId: "E26", requiredMaterialId: "K44", sum: 2},
        {materialId: "E26", requiredMaterialId: "K47", sum: 1},
        {materialId: "E26", requiredMaterialId: "K48", sum: 2},

        {materialId: "E51", requiredMaterialId: "K24", sum: 1},
        {materialId: "E51", requiredMaterialId: "K27", sum: 1},
        {materialId: "E51", requiredMaterialId: "E16", sum: 1},
        {materialId: "E51", requiredMaterialId: "E17", sum: 1},
        {materialId: "E51", requiredMaterialId: "E50", sum: 1},

        {materialId: "E16", requiredMaterialId: "K24", sum: 1},
        {materialId: "E16", requiredMaterialId: "K28", sum: 1},
        {materialId: "E16", requiredMaterialId: "K40", sum: 1},
        {materialId: "E16", requiredMaterialId: "K41", sum: 1},
        {materialId: "E16", requiredMaterialId: "K42", sum: 2},

        {materialId: "E17", requiredMaterialId: "K43", sum: 1},
        {materialId: "E17", requiredMaterialId: "K44", sum: 1},
        {materialId: "E17", requiredMaterialId: "K45", sum: 1},
        {materialId: "E17", requiredMaterialId: "K46", sum: 1},
        
        {materialId: "E50", requiredMaterialId: "K24", sum: 2},
        {materialId: "E50", requiredMaterialId: "K25", sum: 2},
        {materialId: "E50", requiredMaterialId: "E4", sum: 1},
        {materialId: "E50", requiredMaterialId: "E10", sum: 1},
        {materialId: "E50", requiredMaterialId: "E49", sum: 1},

        {materialId: "E4", requiredMaterialId: "K35", sum: 2},
        {materialId: "E4", requiredMaterialId: "K36", sum: 1},
        {materialId: "E4", requiredMaterialId: "K52", sum: 1},
        {materialId: "E4", requiredMaterialId: "K53", sum: 36},

        {materialId: "E10", requiredMaterialId: "K32", sum: 1},
        {materialId: "E10", requiredMaterialId: "K39", sum: 1},
        
        {materialId: "E49", requiredMaterialId: "K24", sum: 1},
        {materialId: "E49", requiredMaterialId: "K25", sum: 2},
        {materialId: "E49", requiredMaterialId: "E7", sum: 1},
        {materialId: "E49", requiredMaterialId: "E13", sum: 1},
        {materialId: "E49", requiredMaterialId: "E18", sum: 1},

        {materialId: "E7", requiredMaterialId: "K35", sum: 2},
        {materialId: "E7", requiredMaterialId: "K37", sum: 1},
        {materialId: "E7", requiredMaterialId: "K38", sum: 1},
        {materialId: "E7", requiredMaterialId: "K52", sum: 1},
        {materialId: "E7", requiredMaterialId: "K53", sum: 36},

        {materialId: "E13", requiredMaterialId: "K32", sum: 1},
        {materialId: "E13", requiredMaterialId: "K39", sum: 1},

        {materialId: "E18", requiredMaterialId: "K28", sum: 3},
        {materialId: "E18", requiredMaterialId: "K32", sum: 1},
        {materialId: "E18", requiredMaterialId: "K59", sum: 2},
      
        // BOM for P2
        {materialId: "P2", requiredMaterialId: "K22", sum: 1},
        {materialId: "P2", requiredMaterialId: "K24", sum: 1},
        {materialId: "P2", requiredMaterialId: "K27", sum: 1},
        {materialId: "P2", requiredMaterialId: "E26", sum: 1},
        {materialId: "P2", requiredMaterialId: "E56", sum: 1},
        {materialId: "P2", requiredMaterialId: "E55", sum: 1},
        {materialId: "E55", requiredMaterialId: "E5", sum: 1},
        {materialId: "E5", requiredMaterialId: "K35", sum: 2},
        {materialId: "E5", requiredMaterialId: "K36", sum: 1},
        {materialId: "E5", requiredMaterialId: "K57", sum: 1},
        {materialId: "E5", requiredMaterialId: "K58", sum: 36},
        {materialId: "P2", requiredMaterialId: "E54", sum: 1},
        {materialId: "E54", requiredMaterialId: "K24", sum: 2},
        {materialId: "E54", requiredMaterialId: "K25", sum: 2},
        {materialId: "E54", requiredMaterialId: "E8", sum: 1},
        {materialId: "E8", requiredMaterialId: "K35", sum: 2},
        {materialId: "E8", requiredMaterialId: "K37", sum: 1},
        {materialId: "E8", requiredMaterialId: "K38", sum: 1},
        {materialId: "E8", requiredMaterialId: "K57", sum: 1},
        {materialId: "E8", requiredMaterialId: "K58", sum: 36},
        {materialId: "P2", requiredMaterialId: "E14", sum: 1},
        {materialId: "E14", requiredMaterialId: "K32", sum: 1},
        {materialId: "E14", requiredMaterialId: "K39", sum: 1},
        {materialId: "P2", requiredMaterialId: "E19", sum: 1},
        {materialId: "E19", requiredMaterialId: "K28", sum: 4},
        {materialId: "E19", requiredMaterialId: "K32", sum: 1},
        {materialId: "E19", requiredMaterialId: "K59", sum: 2},
      
        // BOM for P3
        {materialId: "P3", requiredMaterialId: "K23", sum: 1},
        {materialId: "P3", requiredMaterialId: "K24", sum: 1},
        {materialId: "P3", requiredMaterialId: "K27", sum: 1},
        {materialId: "P3", requiredMaterialId: "E26", sum: 1},
        {materialId: "P3", requiredMaterialId: "E31", sum: 1},
        {materialId: "E31", requiredMaterialId: "K24", sum: 1},
        {materialId: "E31", requiredMaterialId: "K27", sum: 1},
        {materialId: "E31", requiredMaterialId: "E16", sum: 1},
        {materialId: "E31", requiredMaterialId: "E17", sum: 1},
        {materialId: "P3", requiredMaterialId: "E30", sum: 1},
        {materialId: "E30", requiredMaterialId: "K24", sum: 2},
        {materialId: "E30", requiredMaterialId: "K25", sum: 2},
        {materialId: "E30", requiredMaterialId: "E6", sum: 1},
        {materialId: "E6", requiredMaterialId: "K33", sum: 1},
        {materialId: "E6", requiredMaterialId: "K34", sum: 36},
        {materialId: "E30", requiredMaterialId: "E12", sum: 1},
        {materialId: "E12", requiredMaterialId: "K32", sum: 1},
        {materialId: "E12", requiredMaterialId: "K39", sum: 1},
        {materialId: "E30", requiredMaterialId: "E29", sum: 1},
        {materialId: "E29", requiredMaterialId: "K24", sum: 1},
        {materialId: "E29", requiredMaterialId: "K25", sum: 2},
        {materialId: "E29", requiredMaterialId: "E9", sum: 1},
        {materialId: "E9", requiredMaterialId: "K33", sum: 1},
        {materialId: "E9", requiredMaterialId: "K34", sum: 36},
        {materialId: "P3", requiredMaterialId: "E15", sum: 1},
        {materialId: "E15", requiredMaterialId: "K32", sum: 1},
        {materialId: "E15", requiredMaterialId: "K39", sum: 1},
        {materialId: "P3", requiredMaterialId: "E20", sum: 1},
        {materialId: "E20", requiredMaterialId: "K28", sum: 5},
        {materialId: "E20", requiredMaterialId: "K32", sum: 1},
        {materialId: "E20", requiredMaterialId: "K59", sum: 2}
    ];

    await prisma.materialRequirement.createMany({
        data: materialRequirements,
    })
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