import { supabase } from '@/lib/supabase/client'
import RxDB from 'rxdb'

export async function setupOfflineSync(tenantId: string) {
  const db = await RxDB.create({
    name: 'offline_db',
    adapter: 'idb'
  })

  // Create collections mirroring Supabase tables
  await db.addCollections({
    requests: {
      schema: requestSchema // Define JSON schema
    }
  })

  // Setup sync with Supabase
  supabase.channel('requests')
    .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
      db.requests.upsert(payload.new)
    })
    .subscribe()
} 