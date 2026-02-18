import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Heart, Briefcase, FileText, Phone, Mail, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Section, Container, Button } from "@/components/ui";
import { TeamMemberCard, CTABanner } from "@/components/common";
import { teamMembers } from "@/data/team";

export const metadata: Metadata = {
  title: "Consulenti Italiani | Servizi Legali per la Comunità Italiana",
  description:
    "Servizi legali dedicati alla comunità italiana a Londra. Assistenza in italiano per immigrazione, diritto di famiglia, lavoro e altro. Stone & Co. Solicitors.",
  keywords: [
    "avvocato italiano londra",
    "consulente legale italiano",
    "immigrazione italiana londra",
    "diritto di famiglia italiano",
  ],
};

const services = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Immigrazione",
    titleEn: "Immigration",
    description:
      "Visti, permessi di soggiorno, status di residente, cittadinanza britannica, e questioni relative alla Brexit.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Diritto di Famiglia",
    titleEn: "Family Law",
    description:
      "Divorzio, separazione, accordi prematrimoniali, custodia dei figli e divisione patrimoniale.",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Diritto del Lavoro",
    titleEn: "Employment Law",
    description:
      "Controversie sul lavoro, licenziamento ingiusto, discriminazione e contratti di lavoro.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Questioni Civili",
    titleEn: "Civil Matters",
    description:
      "Contratti, controversie commerciali, proprietà immobiliare e contenziosi civili.",
  },
];

export default function ConsulentiItalianiPage() {
  // Get Italian-speaking team members
  const italianSpeakers = teamMembers.filter((member) =>
    member.languages?.includes("Italian")
  );

  return (
    <>
      {/* Hero - Italian themed */}
      <section className="relative bg-neutral-900 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background with Italian flag colors accent */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-1/3 h-1 bg-green-600" />
          <div className="absolute top-0 left-1/3 w-1/3 h-1 bg-white" />
          <div className="absolute top-0 right-0 w-1/3 h-1 bg-red-600" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(184,134,11,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(184,134,11,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <Container className="relative">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-600/20 rounded-full text-gold-400 text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              Servizi in Italiano
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Consulenti Italiani
            </h1>

            <p className="text-xl text-gold-400 font-medium mb-4">
              Assistenza Legale per la Comunità Italiana a Londra
            </p>

            <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
              Il nostro team dedicato offre servizi legali completi in italiano.
              Comprendiamo le sfide uniche che la comunità italiana affronta nel
              Regno Unito e siamo qui per aiutarvi.
            </p>

            <p className="text-neutral-400 mb-8 italic">
              Our dedicated team offers comprehensive legal services in Italian.
              We understand the unique challenges the Italian community faces in
              the UK and we're here to help.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">Contattaci</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <a href="tel:020XXXXXXXX">
                  <Phone className="w-5 h-5 mr-2" />
                  Chiamaci Ora
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <Section variant="default" padding="lg">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            I Nostri Servizi
          </h2>
          <p className="text-lg text-text-secondary">
            Offriamo una gamma completa di servizi legali con assistenza
            completa in italiano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-gold-300 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                {service.title}
              </h3>
              <p className="text-sm text-gold-600 mb-3">{service.titleEn}</p>
              <p className="text-text-secondary text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section variant="alternate" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-8 text-center">
            Perché Sceglierci?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Fluenti in Italiano
              </h3>
              <p className="text-text-secondary text-sm">
                I nostri avvocati parlano italiano fluentemente, garantendo una
                comunicazione chiara e precisa.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Comprendiamo le Vostre Esigenze
              </h3>
              <p className="text-text-secondary text-sm">
                Esperienza specifica con le questioni legali che interessano la
                comunità italiana.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Esperienza Comprovata
              </h3>
              <p className="text-text-secondary text-sm">
                Oltre 20 anni di esperienza nel supporto alla comunità italiana
                a Londra.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Italian-speaking Team */}
      {italianSpeakers.length > 0 && (
        <Section variant="default" padding="lg">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Il Nostro Team Italiano
            </h2>
            <p className="text-lg text-text-secondary">
              Incontra i nostri avvocati che parlano italiano.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {italianSpeakers.map((member) => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                title={member.title}
                image={member.image}
                specializations={member.specializations}
                href={`/team/${member.slug}`}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Contact Section */}
      <Section variant="alternate" padding="lg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
            Contattaci Oggi
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Per una consulenza confidenziale in italiano, contattaci tramite
            telefono, email o compila il nostro modulo di contatto.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="tel:020XXXXXXXX"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-lg border border-neutral-200 hover:border-gold-300 hover:shadow-md transition-all"
            >
              <Phone className="w-5 h-5 text-gold-600" />
              <span className="font-medium">020 XXXX XXXX</span>
            </a>
            <a
              href="mailto:italiano@stonelegal.co.uk"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-lg border border-neutral-200 hover:border-gold-300 hover:shadow-md transition-all"
            >
              <Mail className="w-5 h-5 text-gold-600" />
              <span className="font-medium">italiano@stonelegal.co.uk</span>
            </a>
          </div>

          <Button size="lg" asChild>
            <Link href="/contact">
              Compila il Modulo di Contatto
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* CTA */}
      <CTABanner
        title="Hai Bisogno di Assistenza Legale?"
        subtitle="Contattaci oggi per una consulenza confidenziale in italiano."
      />
    </>
  );
}
