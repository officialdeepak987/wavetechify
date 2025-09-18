
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { getTeamMembers } from "@/app/admin/team/_actions/team-actions";


export async function TeamSection() {
  const teamMembers = await getTeamMembers();
  return (
    <section className="py-20 bg-background animate-fade-in-up">
      <div className="container">
        <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase font-headline">Team Members</p>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mt-2">
                Top Skilled Experts
            </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="text-center bg-card p-6 rounded-lg border-2 border-transparent hover:border-primary/10 hover:shadow-lg transition-all">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-40 h-40 rounded-full mx-auto object-cover mb-4"
                  data-ai-hint={member.imageHint}
                />
                <h3 className="text-xl font-bold font-headline text-primary">
                  {member.name}
                </h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
                 <div className="flex justify-center gap-2 mt-4 text-muted-foreground">
                    <Link href={member.twitter || '#'} className="hover:text-primary"><Twitter className="h-5 w-5" /></Link>
                    <Link href={member.linkedin || '#'} className="hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
                 </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild variant="outline">
                <Link href="/about">Our All Experts</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
