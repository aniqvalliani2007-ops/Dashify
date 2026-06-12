import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { parse } from "https://deno.land/std@0.182.0/csv/parse.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ""
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ""
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration env vars.")
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Parse request body
    const { file_id } = await req.json()
    if (!file_id) {
      return new Response(JSON.stringify({ error: 'Missing file_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 1. Fetch file info
    const { data: fileData, error: fileError } = await supabase
      .from('csv_files')
      .select('*')
      .eq('id', file_id)
      .single()

    if (fileError || !fileData) {
      throw new Error(`Failed to fetch file: ${fileError?.message || 'File not found'}`)
    }

    const { file_path, user_id } = fileData

    // 2. Download file from storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('csv_files')
      .download(file_path)

    if (storageError || !storageData) {
      throw new Error(`Failed to download file from storage: ${storageError?.message}`)
    }

    // 3. Read and parse file
    const text = await storageData.text()
    
    // Use stored `columns` field (jsonb) if present; fall back to undefined
    const headerColumns = fileData.columns || undefined

    // Simple CSV parse
    const records = parse(text, {
      skipFirstRow: true,
      columns: headerColumns,
    }) as Record<string, string>[]

    // 4. Batch insert into csv_data
    const batchSize = 250
    let insertedCount = 0

    for (let i = 0; i < records.length; i += batchSize) {
      const chunk = records.slice(i, i + batchSize)
      const rowsToInsert = chunk.map((record, index) => ({
        file_id,
        user_id,
        row_index: i + index,
        row_data: record
      }))

      const { error: insertError } = await supabase
        .from('csv_data')
        .insert(rowsToInsert)

      if (insertError) {
        throw new Error(`Failed to insert batch starting at ${i}: ${insertError.message}`)
      }

      insertedCount += rowsToInsert.length
    }

    // 5. Update row count on csv_files
    await supabase
      .from('csv_files')
      .update({ row_count: insertedCount })
      .eq('id', file_id)

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully processed ${insertedCount} rows.`,
      rows_count: insertedCount
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
