
import { getTechStack } from "@/app/admin/tech-stack/_actions/tech-stack-actions";

const TechLogo = ({ name }: { name: string }) => (
  <div className="flex-shrink-0 mx-8 text-2xl font-bold text-muted-foreground hover:text-primary transition-colors">
    {name}
  </div>
);

export async function TechStackSection() {
    const technologies = await getTechStack();

    if (technologies.length === 0) {
        return null; // Don't render the section if there are no technologies
    }
    
    const techNames = technologies.map(t => t.name);

    return (
        <section className="py-12 bg-background/70">
            <div className="container">
                <div className="relative overflow-hidden group">
                    <div className="flex animate-marquee group-hover:pause">
                        {techNames.map((tech, index) => (
                          <TechLogo key={index} name={tech} />
                        ))}
                         {techNames.map((tech, index) => (
                          <TechLogo key={`clone-${index}`} name={tech} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
