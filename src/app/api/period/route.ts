import { NextResponse } from 'next/server';
import { PrismaClient, Result } from '@prisma/client';
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
                    // console.log(`${ordersToCreate.length} orders successfully saved to the database.`);
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
                                        workplaceId: Number(workplace.$.id)
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

            if (results.ordersinwork && results.ordersinwork[0] && results.ordersinwork[0].workplace) {
                const workplaces = results.ordersinwork[0].workplace;
                const waitinglistEntities = [];

                for (const workplace of workplaces) {
                    if (workplace.$) {
                        const material = await prisma.material.findFirst({
                            where: { id: {
                                endsWith: workplace.$.item,
                            }},
                        });
                        if (material) {
                            waitinglistEntities.push({
                                orderId: Number(workplace.$.order),
                                amount: Number(workplace.$.amount),
                                timeneed: Number(workplace.$.timeneed),
                                periodId: newPeriod.id,
                                materialId: material.id,
                            });
                        }
                    }
                }

                await prisma.waitingQueue.createMany({
                    data: waitinglistEntities,
                });
            }

            if (results.result && results.result[0]) {
              const resultsEntities: Result[] = [];
              const result = results.result[0];

              // console.log(result);

              if (result.normalsale && result.normalsale[0]) {
                const normalsale = result.normalsale[0];
                const typePrefix = "normalsale_";

                if (normalsale.salesprice && normalsale.salesprice[0]) {
                  const salesprice = normalsale.salesprice[0].$;

                  if (salesprice.current && salesprice.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: typePrefix + "capacity",
                      current: parseFloat(salesprice.current),
                      average: parseFloat(salesprice.average),
                    });
                  }
                }

                if (normalsale.profit && normalsale.profit[0]) {
                  const profit = normalsale.profit[0].$;

                  if (profit.current && profit.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: typePrefix + "profit",
                      current: parseFloat(profit.current),
                      average: parseFloat(profit.average),
                    });
                  }
                }

                if (normalsale.profitperunit && normalsale.profitperunit[0]) {
                  const profitperunit = normalsale.profitperunit[0].$;

                  if (profitperunit.current && profitperunit.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: typePrefix + "profitperunit",
                      current: parseFloat(profitperunit.current),
                      average: parseFloat(profitperunit.average),
                    });
                  }
                }
              }

              if (result.directsale && result.directsale[0]) {
                const directsale = result.directsale[0];
                const typePrefix = "directsale_";

                if (directsale.profit && directsale.profit[0]) {
                  const profit = directsale.profit[0].$;

                  if (profit.current && profit.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: typePrefix + "profit",
                      current: parseFloat(profit.current),
                      average: parseFloat(profit.average),
                    });
                  }
                }

                if (directsale.contractpenalty && directsale.contractpenalty[0]) {
                  const contractpenalty = directsale.contractpenalty[0].$;

                  if (contractpenalty.current && contractpenalty.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: typePrefix + "contractpenalty",
                      current: parseFloat(contractpenalty.current),
                      average: parseFloat(contractpenalty.average),
                    });
                  }
                }
              }

              if (result.marketplacesale && result.marketplacesale[0]) {
                const marketplacesale = result.marketplacesale[0];
                const typePrefix = "marketplacesale_";

                if (marketplacesale.profit && marketplacesale.profit[0]) {
                  const profit = marketplacesale.profit[0].$;

                  if (profit.current && profit.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: typePrefix + "profit",
                      current: parseFloat(profit.current),
                      average: parseFloat(profit.average),
                    });
                  }
                }
              }

              if (result.summary && result.summary[0]) {
                const summary = result.summary[0];
                const typePrefix = "summary_";

                if (summary.profit && summary.profit[0]) {
                  const profit = summary.profit[0].$;

                  if (profit.current && profit.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: typePrefix + "profit",
                      current: parseFloat(profit.current),
                      average: parseFloat(profit.average),
                    });
                  }
                }
              }

              if (result.general && result.general[0]) {
                const general = result.general[0];

                if (general.capacity && general.capacity[0]) {
                  const capacity = general.capacity[0].$;
                  if (capacity.current && capacity.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "capacity",
                      current: parseFloat(capacity.current),
                      average: parseFloat(capacity.average),
                    });
                  }
                }

                if (general.possiblecapacity && general.possiblecapacity[0]) {
                  const possiblecapacity = general.possiblecapacity[0].$;
                  if (possiblecapacity.current && possiblecapacity.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "possiblecapacity",
                      current: parseFloat(possiblecapacity.current),
                      average: parseFloat(possiblecapacity.average),
                    });
                  }
                }

                if (general.relpossiblenormalcapacity && general.relpossiblenormalcapacity[0]) {
                  const relpossiblenormalcapacity = general.relpossiblenormalcapacity[0].$;
                  if (relpossiblenormalcapacity.current && relpossiblenormalcapacity.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "relpossiblenormalcapacity",
                      current: parseFloat(relpossiblenormalcapacity.current),
                      average: parseFloat(relpossiblenormalcapacity.average),
                    });
                  }
                }

                if (general.productivetime && general.productivetime[0]) {
                  const productivetime = general.productivetime[0].$;
                  if (productivetime.current && productivetime.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "productivetime",
                      current: parseFloat(productivetime.current),
                      average: parseFloat(productivetime.average),
                    });
                  }
                }

                if (general.effiency && general.effiency[0]) {
                  const effiency = general.effiency[0].$;
                  if (effiency.current && effiency.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "effiency",
                      current: parseFloat(effiency.current),
                      average: parseFloat(effiency.average),
                    });
                  }
                }

                if (general.sellwish && general.sellwish[0]) {
                  const sellwish = general.sellwish[0].$;
                  if (sellwish.current && sellwish.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "sellwish",
                      current: parseFloat(sellwish.current),
                      average: parseFloat(sellwish.average),
                    });
                  }
                }

                if (general.salesquantity && general.salesquantity[0]) {
                  const salesquantity = general.salesquantity[0].$;
                  if (salesquantity.current && salesquantity.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "salesquantity",
                      current: parseFloat(salesquantity.current),
                      average: parseFloat(salesquantity.average),
                    });
                  }
                }

                if (general.deliveryreliability && general.deliveryreliability[0]) {
                  const deliveryreliability = general.deliveryreliability[0].$;
                  if (deliveryreliability.current && deliveryreliability.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "deliveryreliability",
                      current: parseFloat(deliveryreliability.current),
                      average: parseFloat(deliveryreliability.average),
                    });
                  }
                }

                if (general.idletime && general.idletime[0]) {
                  const idletime = general.idletime[0].$;
                  if (idletime.current && idletime.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "idletime",
                      current: parseFloat(idletime.current),
                      average: parseFloat(idletime.average),
                    });
                  }
                }

                if (general.idletimecosts && general.idletimecosts[0]) {
                  const idletimecosts = general.idletimecosts[0].$;
                  if (idletimecosts.current && idletimecosts.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "idletimecosts",
                      current: parseFloat(idletimecosts.current),
                      average: parseFloat(idletimecosts.average),
                    });
                  }
                }

                if (general.storevalue && general.storevalue[0]) {
                  const storevalue = general.storevalue[0].$;
                  if (storevalue.current && storevalue.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "storevalue",
                      current: parseFloat(storevalue.current),
                      average: parseFloat(storevalue.average),
                    });
                  }
                }

                if (general.storagecosts && general.storagecosts[0]) {
                  const storagecosts = general.storagecosts[0].$;
                  if (storagecosts.current && storagecosts.average) {
                    resultsEntities.push({
                      periodId: newPeriod.id,
                      type: "storagecosts",
                      current: parseFloat(storagecosts.current),
                      average: parseFloat(storagecosts.average),
                    });
                  }
                }
              }

              console.log(resultsEntities);
              await prisma.result.createMany({
                data: resultsEntities,
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