
'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, PlusCircle, Trash2, Edit, Check, Loader2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
  } from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { getPricingData, deleteCountry, deletePlan, addOrUpdateCountry, addOrUpdatePlan } from "./_actions/pricing-actions"
import type { CountryPricing, PricingPlan, PricingData } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea";

// Combines the country code into the object for easier handling
function processPricingData(data: PricingData): CountryPricing[] {
    return Object.entries(data).map(([countryCode, details]) => {
        // Sort plans by price for each country
        const sortedPlans = details.plans.sort((a, b) => a.priceMonthly - b.priceMonthly);
        return {
            countryCode,
            ...details,
            plans: sortedPlans,
        };
    });
}


export default function PricingPage() {
    const [pricingData, setPricingData] = useState<CountryPricing[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchPricing = async () => {
        setLoading(true);
        try {
            const data = await getPricingData();
            setPricingData(processPricingData(data));
        } catch (error) {
            toast({ title: "Error", description: "Failed to load pricing data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPricing();
    }, []);

    const handleDeleteCountry = async (countryCode: string) => {
        const result = await deleteCountry(countryCode);
        if (result.success) {
            await fetchPricing();
            toast({ title: "Country Deleted", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    };

    const handleDeletePlan = async (countryCode: string, planId: string) => {
        const result = await deletePlan(countryCode, planId);
        if (result.success) {
            await fetchPricing();
            toast({ title: "Plan Deleted", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Pricing Plan Management</h1>
                    <p className="text-muted-foreground">Add, edit, or remove countries and their pricing tiers.</p>
                </div>
                <CountryForm onSave={fetchPricing}>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Country</Button>
                </CountryForm>
            </div>

            {pricingData.map((country) => (
                <Card key={country.countryCode}>
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">{country.name} ({country.countryCode})</CardTitle>
                            <CardDescription>Currency: {country.currency} ({country.currencySymbol})</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                             <PlanForm countryCode={country.countryCode} onSave={fetchPricing}>
                                <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Plan</Button>
                             </PlanForm>
                             <CountryForm country={country} onSave={fetchPricing}>
                                <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Edit Country</Button>
                             </CountryForm>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Delete Country</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will permanently delete the country '{country.name}' and all its plans.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteCountry(country.countryCode)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                           {country.plans.map(plan => (
                                <Card key={plan.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                                        <CardDescription className="text-2xl font-bold text-primary">{country.currencySymbol}{plan.priceMonthly}<span className="text-sm font-normal text-muted-foreground">{plan.priceSuffix}</span></CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                           {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />{feature}</li>
                                           ))}
                                        </ul>
                                    </CardContent>
                                    <div className="p-4 pt-0 flex gap-2">
                                        <PlanForm countryCode={country.countryCode} plan={plan} onSave={fetchPricing}>
                                            <Button variant="outline" size="sm" className="w-full"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                        </PlanForm>
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm" className="w-full"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete this plan?</AlertDialogTitle>
                                                    <AlertDialogDescription>This will permanently delete the '{plan.name}' plan.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeletePlan(country.countryCode, plan.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </Card>
                           ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}


function CountryForm({ children, country, onSave }: { children: React.ReactNode, country?: CountryPricing, onSave: () => void }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await addOrUpdateCountry(formData);
        if (result.success) {
            onSave();
            setOpen(false);
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{country ? "Edit" : "Add"} Country</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="countryCode">Country Code (2 letters)</Label>
                        <Input id="countryCode" name="countryCode" defaultValue={country?.countryCode} maxLength={2} required readOnly={!!country} />
                    </div>
                     <div>
                        <Label htmlFor="name">Country Name</Label>
                        <Input id="name" name="name" defaultValue={country?.name} required />
                    </div>
                     <div>
                        <Label htmlFor="currency">Currency Code (e.g., INR)</Label>
                        <Input id="currency" name="currency" defaultValue={country?.currency} maxLength={3} required />
                    </div>
                     <div>
                        <Label htmlFor="currencySymbol">Currency Symbol (e.g., ₹)</Label>
                        <Input id="currencySymbol" name="currencySymbol" defaultValue={country?.currencySymbol} required />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                        <Button type="submit">Save Country</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function PlanForm({ children, countryCode, plan, onSave }: { children: React.ReactNode, countryCode: string, plan?: PricingPlan, onSave: () => void }) {
     const [open, setOpen] = useState(false);
     const { toast } = useToast();

     async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append('countryCode', countryCode);
        if (plan) {
            formData.append('id', plan.id);
        }
        
        const result = await addOrUpdatePlan(formData);

        if (result.success) {
            onSave();
            setOpen(false);
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    }

    return (
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{plan ? 'Edit' : 'Add'} Plan for {countryCode}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Plan Name</Label>
                        <Input id="name" name="name" defaultValue={plan?.name} required />
                    </div>
                    <div>
                        <Label htmlFor="priceMonthly">Price</Label>
                        <Input id="priceMonthly" name="priceMonthly" type="number" defaultValue={plan?.priceMonthly} required />
                    </div>
                     <div>
                        <Label htmlFor="priceSuffix">Price Suffix (e.g. /one-time)</Label>
                        <Input id="priceSuffix" name="priceSuffix" defaultValue={plan?.priceSuffix} required />
                    </div>
                    <div>
                        <Label htmlFor="features">Features (comma-separated)</Label>
                        <Textarea id="features" name="features" defaultValue={plan?.features.join(', ')} required />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                        <Button type="submit">Save Plan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
