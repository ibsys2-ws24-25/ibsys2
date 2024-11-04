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

export default function CreatePeriod() {
    const [id, setId] = useState<number | undefined>();
    const [xmlFile, setXmlFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const createPeriod = async () => {
        if (!id) {
            alert("Please enter a valid ID.");
            return;
        }

        if (!xmlFile) {
            alert("Please upload an XML file.");
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData to send both ID and file
            const formData = new FormData();
            formData.append("id", String(id));
            formData.append("file", xmlFile);

            const response = await fetch('/api/period', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.log(response);
                throw new Error("Failed to create period.");
            }

            router.push(`/periods/${id}`);
        } catch (error) {
            console.error("Error creating period:", error);
            alert("Error creating period. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Create Period
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new period</DialogTitle>
                    <DialogDescription>
                        Here you can upload a new input.xml file to create a new period.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="id" className="text-right">
                            Id
                        </Label>
                        <Input
                            id="id"
                            className="col-span-3"
                            type="number"
                            step={1}
                            min={1}
                            value={id}
                            onChange={(e) => setId(Number(e.target.value))}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="xmlFile" className="text-right">
                            Upload File
                        </Label>
                        <Input
                            id="xmlFile"
                            type="file"
                            className="col-span-3"
                            onChange={(e) => setXmlFile(e.target.files ? e.target.files[0] : null)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={createPeriod} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create period"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};