import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://npogbtrqxklvjiwgvcys.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wb2didHJxeGtsdmppd2d2Y3lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA4MTM2NiwiZXhwIjoyMDk2NjU3MzY2fQ.gfGtiaIzas3_xWm1QyFiYHXZhPRsxAQMFo-3lYYA79o';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const LOGOS = [
  { file: '3ec24330241bfcb564640e61fca49c938d1100a0.png', name: 'ZEP-RE', description: 'PTA Reinsurance Company' },
  { file: '1a0d845ab45814f634b9c33a189fcd6e436d0096.png', name: 'Soliton Telmec', description: 'Technology Solutions' },
  { file: '6af2017f891e4f62b4af065527c3fc67ea0fbc5c.png', name: 'Tropic Air', description: 'Aviation Services' },
  { file: 'a2a4cb6d0c63bb017067b5f1751c3abc678c1bb4.png', name: 'OML Africa Logistics', description: 'Logistics & Supply Chain' },
  { file: '41ae7913bf04c4949c652f9da48f33a0a06e1ddd.png', name: 'PowerGroup Technologies', description: 'Technology & Engineering' },
  { file: '0b6ae337336e83091b49c86ad967e0194f344223.png', name: 'Qualibasic Seeds', description: 'Agricultural Innovation' },
];

async function run() {
  console.log('Syncing logos to Supabase...\n');

  for (const logo of LOGOS) {
    const storageName = `${logo.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/client-logos/${storageName}`;

    // Try to upload image (skip if already uploaded / file missing)
    const filePath = resolve(__dirname, 'src/assets', logo.file);
    try {
      const fileBuffer = readFileSync(filePath);
      const { error } = await supabase.storage
        .from('client-logos')
        .upload(storageName, fileBuffer, { contentType: 'image/png', upsert: true });
      if (error) {
        console.log(`  ~ Storage: ${logo.name} already uploaded or skipped (${error.message})`);
      } else {
        console.log(`  ✓ Uploaded ${logo.name} to storage`);
      }
    } catch {
      console.log(`  ~ Storage: ${logo.name} file not found locally, using existing URL`);
    }

    // Always save KV record (this is the critical part)
    await saveLogo(logo.name, logo.description, publicUrl);
  }

  console.log('\nAll done! Refresh your admin panel to see the logos.');
}

async function saveLogo(name, description, logoUrl) {
  const id = name.toLowerCase().replace(/\s+/g, '-');
  const now = new Date().toISOString();
  const value = { id, name, description, logoUrl, createdAt: now };
  const { error } = await supabase
    .from('kv_store_420cbc7d')
    .upsert({ key: `client_logos_420cbc7d:${id}`, value }, { onConflict: 'key' });
  if (error) {
    console.error(`  ERROR saving "${name}":`, error.message);
  } else {
    console.log(`  ✓ Saved "${name}" to database`);
  }
}

run().catch(console.error);
