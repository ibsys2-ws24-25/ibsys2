import { Metadata } from "next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Material } from "@prisma/client";

export const metadata: Metadata = {
    title: 'Bill of Materials',
};

interface MaterialWithRequirements extends Material {
    MaterialsRequired: {
      id: number;
      sum: number;
      RequiredMaterial: Material;
    }[];
    MaterialsRequiredBy: {
      id: number;
      sum: number;
      Material: Material;
    }[];
}

async function fetchMaterials() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/material`, {
        cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch materials');
    }
    return response.json();
}

export default async function BillOfMaterials() {
    const materials = await fetchMaterials();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {materials.map((material: MaterialWithRequirements) => {
                return (
                    <Card key={material.id} className="shadow-lg p-4">
                        <CardHeader>
                            <CardTitle>{material.id}</CardTitle>
                            <CardDescription>{material.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h2 className="font-semibold mt-2">Requires:</h2>
                            {material.MaterialsRequired.map((requirement) => (
                                <p key={requirement.id}>
                                    {requirement.RequiredMaterial.id}: {requirement.RequiredMaterial.name} - Quantity: {requirement.sum}
                                </p>
                            ))}
                            <h2 className="font-semibold mt-4">Required by:</h2>
                            {material.MaterialsRequiredBy.map((requirement) => (
                                <p key={requirement.id}>
                                    {requirement.Material.id}: {requirement.Material.name} - Quantity: {requirement.sum}
                                </p>
                            ))}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
}