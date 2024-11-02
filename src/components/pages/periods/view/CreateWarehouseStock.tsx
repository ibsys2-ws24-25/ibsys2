'use client';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export interface CreateWarehouseStockProps {
    periodId: number;
}

export default function CreateWarehouseStock({ periodId }: CreateWarehouseStockProps) {
    const [materialId, setMaterialId] = useState<string>("");
    const [amount, setAmount] = useState<number | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const createWarehouseStock = async () => {
        if (!periodId || !materialId || amount === undefined) {
            alert("Please enter a valid Period ID, Material ID, and Amount.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/period/[periodId]/warehouse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ periodId, materialId, amount }),
            });

            if (!response.ok) {
                console.log(response);
                throw new Error("Failed to create warehouse stock.");
            }

            router.push(`/periods/${periodId}`);
        } catch (error) {
            console.error("Error creating warehouse stock:", error);
            alert("Error creating warehouse stock. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Create Warehouse Stock
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new Warehouse Stock</DialogTitle>
                    <DialogDescription>
                        Enter the details below to create a new warehouse stock entry.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="materialId" className="text-right">
                            Material ID
                        </Label>
                        <Input
                            id="materialId"
                            className="col-span-3"
                            type="text"
                            value={materialId}
                            onChange={(e) => setMaterialId(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            className="col-span-3"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={createWarehouseStock} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Warehouse Stock"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}