import { Metadata } from "next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Material } from "@prisma/client";
import initTranslation from '@/i18n';

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

export default async function BillOfMaterials({ params }: { params: { locale: string } }) {
    const materials = await fetchMaterials();
    const { t } = await initTranslation(params.locale, ['bom']);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-10">
            {materials.map((material: MaterialWithRequirements) => {
                return (
                    <Card key={material.id} className="shadow-lg p-4">
                        <CardHeader>
                            <CardTitle>{material.id}</CardTitle>
                            <CardDescription>{material.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h2 className="font-semibold mt-2">{t("requires")}:</h2>
                            {material.MaterialsRequired.map((requirement) => (
                                <p key={requirement.id}>
                                    {requirement.RequiredMaterial.id}: {requirement.RequiredMaterial.name} - {t("quantity")}: {requirement.sum}
                                </p>
                            ))}
                            <h2 className="font-semibold mt-4">{t("required_by")}:</h2>
                            {material.MaterialsRequiredBy.map((requirement) => (
                                <p key={requirement.id}>
                                    {requirement.Material.id}: {requirement.Material.name} - {t("quantity")}: {requirement.sum}
                                </p>
                            ))}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
}