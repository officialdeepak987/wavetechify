
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import type { SiteSettings } from '@/lib/types';
import { getSiteSettings } from '../admin/settings/_actions/settings-actions';
import { ContactForm } from './_components/contact-form';


export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-background">
        <section className="container text-center py-20">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Contact Us</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Have a question or a project in mind? We'd love to hear from you. Fill out the form below or reach out to us directly.
            </p>
        </section>
        
        <section className="container pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Send us a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ContactForm />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Contact Information</CardTitle>
                            <CardDescription>Reach out to us directly through these channels.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                             <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-primary">Our Office</h4>
                                    <p className="text-muted-foreground">{settings.officeAddress}</p>
                                </div>
                             </div>
                              <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-primary">Phone</h4>
                                    <p className="text-muted-foreground">{settings.contactPhone}</p>
                                </div>
                             </div>
                             <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-primary">Email</h4>
                                    <p className="text-muted-foreground">{settings.contactEmail}</p>
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    </div>
  );
}
