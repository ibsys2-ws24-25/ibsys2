import { NextResponse } from 'next/server';
import { PrismaClient, WaitingQueue } from '@prisma/client';
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
                
                id = Number(xmlData.results.$.period);
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

            // Create forecast
            if (results.forecast[0]) {
                const forecast = results.forecast[0];

                // console.log(forecast);

                const forecastEntities = [];
                
                if (forecast.$) {
                    forecastEntities.push({
                        forPeriod: Number(id),
                        periodId: Number(id),
                        materialId: "P1",
                        amount: Number(forecast.$.p1),
                    });

                    forecastEntities.push({
                        forPeriod: Number(id),
                        periodId: Number(id),
                        materialId: "P2",
                        amount: Number(forecast.$.p2),
                    });

                    forecastEntities.push({
                        forPeriod: Number(id),
                        periodId: Number(id),
                        materialId: "P3",
                        amount: Number(forecast.$.p3),
                    });

                    // Saving warehouse stock to DB
                    await prisma.forecast.createMany({
                        data: forecastEntities,
                    });
                }
            }

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
            
                const ordersToCreate = [];
            
                for (const order of futureinwardstockmovement) {
                    const materialId = order.$.article;
                    const material = await prisma.material.findFirst({
                        where: {
                            id: {
                                contains: materialId
                            }
                        }
                    })
                    
                    if (material) {
                        ordersToCreate.push({
                            orderId: Number(order.$.id),
                            orderPeriod: Number(order.$.orderperiod),
                            mode: Number(order.$.mode),
                            amount: Number(order.$.amount),
                            materialId: material.id,
                            periodId: newPeriod.id,
                        });
                    } else {
                        console.warn(`Material ID ${materialId} does not exist. Skipping order.`);
                    }
                }
            
                if (ordersToCreate.length > 0) {
                    await prisma.order.createMany({
                        data: ordersToCreate,
                    });
                    console.log(`${ordersToCreate.length} orders successfully saved to the database.`);
                } else {
                    console.warn('No valid orders to save.');
                }
            }

            // waiting queue
            if (results.waitinglistworkstations && results.waitinglistworkstations[0] && results.waitinglistworkstations[0].workplace) {
                const waitinglistEntities = [];
                const workplaces = results.waitinglistworkstations[0].workplace;
                for (const workplace of workplaces) {
                    if (workplace.waitinglist) {
                        const waitinglist = workplace.waitinglist;

                        for (const waitinglistElement of waitinglist) {
                            if (waitinglistElement.$) {
                                const material = await prisma.material.findFirst({
                                    where: { id: {
                                        endsWith: waitinglistElement.$.item,
                                    }},
                                });
                                if (material) {
                                    waitinglistEntities.push({
                                        orderId: Number(waitinglistElement.$.order),
                                        firstBatch: Number(waitinglistElement.$.firstbatch),
                                        lastBatch: Number(waitinglistElement.$.lastbatch),
                                        amount: Number(waitinglistElement.$.amount),
                                        timeneed: Number(waitinglistElement.$.timeneed),
                                        periodId: newPeriod.id,
                                        materialId: material.id,
                                    });
                                }
                            }
                        }
                    }
                }

                await prisma.waitingQueue.createMany({
                    data: waitinglistEntities,
                });
            }

            if (results.waitingliststock && results.waitingliststock[0] && results.waitingliststock[0].missingpart) {
                const waitinglistEntities = [];
                for (const missingpart of results.waitingliststock[0].missingpart) {
                    if (missingpart.workplace) {
                        for (const queue of missingpart.workplace) {
                            for (const waitinglistElement of queue.waitinglist) {
                                if (waitinglistElement.$) {
                                    const material = await prisma.material.findFirst({
                                        where: { id: {
                                            endsWith: waitinglistElement.$.item,
                                        }},
                                    });
                                    if (material) {
                                        waitinglistEntities.push({
                                            orderId: Number(waitinglistElement.$.order),
                                            firstBatch: Number(waitinglistElement.$.firstbatch),
                                            lastBatch: Number(waitinglistElement.$.lastbatch),
                                            amount: Number(waitinglistElement.$.amount),
                                            timeneed: Number(waitinglistElement.$.timeNeed),
                                            periodId: newPeriod.id,
                                            materialId: material.id,
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                
                await prisma.waitingQueue.createMany({
                    data: waitinglistEntities,
                });
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