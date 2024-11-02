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

export default async function CreatePeriod() {
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
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="xmlFile" className="text-right">
                            Upload File
                        </Label>
                        <Input id="xmlFile" type="file" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button>Create period</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
