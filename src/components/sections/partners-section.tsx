
import { Computer, ShieldCheck, Database, Server } from "lucide-react";

const partners = [
  { name: "Digital Wizards", icon: Computer },
  { name: "Byte Guard", icon: ShieldCheck },
  { name: "Inno Secure", icon: Database },
  { name: "Compute Solutions", icon: Server },
]

export function PartnersSection() {
    return (
        <section className="py-20 bg-primary/5">
            <div className="container animate-fade-in-up">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {partners.map((partner, index) => (
                        <div key={index} className="flex flex-col items-center justify-center gap-4">
                            <partner.icon className="h-10 w-10 text-accent" />
                            <h3 className="text-lg font-semibold text-primary">{partner.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
