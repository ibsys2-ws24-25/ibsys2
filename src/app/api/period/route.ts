import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseStringPromise } from 'xml2js';

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    const periods = await prisma.period.findMany();

    return NextResponse.json(periods);
  } catch (error) {
    console.error("Error fetching periods:", error);
    return NextResponse.json({ error: "Error fetching periods" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
    const prisma = new PrismaClient();
    
    try {
        const contentType = request.headers.get("content-type") || "";
        
        // Handle JSON input to retrieve the "id" field
        let xmlData;
        let id;
        
        if (contentType.includes("multipart/form-data")) {
            // Assume the XML is part of form-data
            const formData = await request.formData();
            
            // Retrieve XML file from form-data
            const xmlFile = formData.get("file");

            if (xmlFile && typeof xmlFile === 'object' && xmlFile instanceof File) {
                const xmlText = await xmlFile.text();
                
                // Parse XML data
                xmlData = await parseStringPromise(xmlText);
                
                id = xmlData.results.$.period;
            } else {
                console.log("No XML file found in form data or file is not a valid File object.");
            }
        }

        // Validate ID
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Save data to the database, including parsed XML if required
        const newPeriod = await prisma.period.create({
            data: {
                id: Number(id),
            },
        });

        // Validate XML Schema
        if (xmlData && xmlData.results) {
            const results = xmlData.results;

            console.log(results);

            // Check for warehouse entries
            if (results.warehousestock) {
                const warehousestock = results.warehousestock[0];
                
                if (warehousestock.article) {
                    const warehouseStockEntities = [];
                    for (const article of warehousestock.article) {
                        // console.log(article);
                        const articleEntity = await prisma.material.findFirst({
                            where: {
                                id: {
                                    contains: article.$.id
                                }
                            }
                        });
                        
                        if (articleEntity) {
                            warehouseStockEntities.push({
                                periodId: Number(id),
                                materialId: articleEntity?.id,
                                amount: Number(article.$.amount)
                            });
                        }
                    }

                    // Saving warehouse stock to DB
                    await prisma.warehouse.createMany({
                        data: warehouseStockEntities,
                    });
                }
            }

            if (results.futureinwardstockmovement) {
                const futureinwardstockmovement = results.futureinwardstockmovement[0].order;

                console.log(futureinwardstockmovement);
            }
        }
        
        return NextResponse.json(
            newPeriod,
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating period:", error);
        return NextResponse.json({ error: "Error creating period" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}