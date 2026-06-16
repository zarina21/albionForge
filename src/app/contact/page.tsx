import type { Metadata } from "next";
import { Mail, Github, Globe, Building2 } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Nova Enterprice Online — contact information, email and GitHub.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Albion Forge — Contact",
    description: "Contact Nova Enterprice Online for support, inquiries and collaboration.",
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center">
          <h1 className="font-display text-4xl text-gold mb-3">Contact</h1>
          <p className="text-muted-foreground">
            Get in touch with Nova Enterprice Online.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-4">
            <Building2 className="w-5 h-5 text-gold shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-medium">Nova Enterprice Online</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Mail className="w-5 h-5 text-gold shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <ul className="space-y-1">
                <li>
                  <a href="mailto:noyogavilano@gmail.com" className="text-gold hover:underline text-sm">
                    noyogavilano@gmail.com
                  </a>
                </li>
                <li>
                  <a href="mailto:zarinagavilano@gmail.com" className="text-gold hover:underline text-sm">
                    zarinagavilano@gmail.com
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@novaenterprice.online" className="text-gold hover:underline text-sm">
                    contact@novaenterprice.online
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Github className="w-5 h-5 text-gold shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">GitHub</p>
              <a
                href="https://github.com/zarina21"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline text-sm"
              >
                github.com/zarina21
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Globe className="w-5 h-5 text-gold shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Website</p>
              <a
                href="https://novaenterprice.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline text-sm"
              >
                novaenterprice.online
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}