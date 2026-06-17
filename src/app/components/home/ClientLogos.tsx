import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import zepReLogo from '../../../assets/3ec24330241bfcb564640e61fca49c938d1100a0.png';
import solitonLogo from '../../../assets/1a0d845ab45814f634b9c33a189fcd6e436d0096.png';
import tropicAirLogo from '../../../assets/6af2017f891e4f62b4af065527c3fc67ea0fbc5c.png';
import omlLogo from '../../../assets/a2a4cb6d0c63bb017067b5f1751c3abc678c1bb4.png';
import powerGroupLogo from '../../../assets/41ae7913bf04c4949c652f9da48f33a0a06e1ddd.png';
import qualibasicLogo from '../../../assets/0b6ae337336e83091b49c86ad967e0194f344223.png';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;

interface ClientLogo {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
}

const FALLBACK_LOGOS: ClientLogo[] = [
  { id: 'zep-re', name: 'ZEP-RE', description: 'PTA Reinsurance Company', logoUrl: zepReLogo },
  { id: 'soliton', name: 'Soliton Telmec', description: 'Technology Solutions', logoUrl: solitonLogo },
  { id: 'tropic-air', name: 'Tropic Air', description: 'Aviation Services', logoUrl: tropicAirLogo },
  { id: 'oml', name: 'OML Africa Logistics', description: 'Logistics & Supply Chain', logoUrl: omlLogo },
  { id: 'powergroup', name: 'PowerGroup Technologies', description: 'Technology & Engineering', logoUrl: powerGroupLogo },
  { id: 'qualibasic', name: 'Qualibasic Seeds', description: 'Agricultural Innovation', logoUrl: qualibasicLogo },
];

export default function ClientLogos() {
  const [logos, setLogos] = useState<ClientLogo[]>(FALLBACK_LOGOS);

  useEffect(() => {
    fetch(`${API_BASE}/logos`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLogos(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-8 md:py-16 bg-white" style={{ contentVisibility: 'auto' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Trusted by Leading Organizations
          </h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            We've delivered transformative training solutions to industry leaders across multiple sectors
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
          {logos.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl p-4 md:p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow group border border-gray-100"
            >
              <div className="h-12 md:h-16 w-full flex items-center justify-center mb-3">
                {client.logoUrl ? (
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="h-full w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="h-12 w-12 md:h-16 md:w-16 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                    <span className="font-bold text-lg text-primary group-hover:text-white">
                      {client.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-900 text-center line-clamp-1">
                {client.name}
              </p>
              {client.description && (
                <p className="text-[10px] text-gray-500 text-center mt-1 line-clamp-1">
                  {client.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-12 text-center">
          <p className="text-sm md:text-base text-gray-600">
            Ready to join these industry leaders?{' '}
            <a href="/contact" className="text-primary font-semibold hover:underline">
              Get started today
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
