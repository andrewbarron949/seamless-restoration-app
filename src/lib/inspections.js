import { supabase } from './supabase'

export async function createInspection(inspectionData) {
  try {
    // First, create or get the case
    let caseData
    const { data: existingCase } = await supabase
      .from('cases')
      .select('*')
      .eq('case_number', inspectionData.caseNumber)
      .single()

    if (existingCase) {
      caseData = existingCase
    } else {
      const { data: newCase, error: caseError } = await supabase
        .from('cases')
        .insert([
          {
            case_number: inspectionData.caseNumber,
            claim_number: inspectionData.claimNumber,
            insurance_company: inspectionData.insuranceCompany,
            client_name: inspectionData.policyHolder,
            loss_date: inspectionData.dateOfLoss,
            property_address: inspectionData.propertyAddress,
            property_city: inspectionData.propertyCity || '',
            property_state: inspectionData.propertyState || '',
            property_zip: inspectionData.propertyZip || '',
            loss_type: inspectionData.lossType || '',
            created_by: inspectionData.inspectorId
          }
        ])
        .select()
        .single()

      if (caseError) throw caseError
      caseData = newCase
    }

    // Create the inspection record
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .insert([
        {
          case_id: caseData.id,
          inspector_id: inspectionData.inspectorId,
          inspection_date: new Date().toISOString().split('T')[0], // Today's date
          inspection_type: 'initial', // Default type
          status: inspectionData.status || 'submitted',
          location_details: inspectionData.propertyAddress,
          general_notes: inspectionData.inspectorNotes || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (inspectionError) throw inspectionError

    // Create the detailed inspection data
    const { data: details, error: detailsError } = await supabase
      .from('inspection_items')
      .insert([
        {
          inspection_id: inspection.id,
          item_category: inspectionData.itemCategory,
          item_type: inspectionData.itemType || '',
          item_description: inspectionData.itemDescription,
          room_location: inspectionData.roomLocation,
          damage_type: inspectionData.damageType || '',
          damage_severity: inspectionData.damageSeverity || 'minor',
          damage_description: inspectionData.damageDescription,
          repair_recommendation: inspectionData.repairRecommendation || '',
          replacement_needed: inspectionData.replacementNeeded || false
        }
      ])
      .select()
      .single()

    if (detailsError) throw detailsError

    return { data: { ...inspection, details, case: caseData }, error: null }
  } catch (error) {
    console.error('Error creating inspection:', error)
    return { data: null, error }
  }
}

export async function uploadInspectionPhotos(inspectionId, photos) {
  try {
    const uploadedPhotos = []
    
    for (const photo of photos) {
      const fileExt = photo.file.name.split('.').pop()
      const fileName = `${inspectionId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('inspection-photos')
        .upload(fileName, photo.file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: _urlData } = supabase.storage
        .from('inspection-photos')
        .getPublicUrl(fileName)

      // Save photo record to database
      const { data: photoData, error: photoError } = await supabase
        .from('photos')
        .insert([
          {
            inspection_id: inspectionId,
            file_name: photo.file.name,
            file_path: fileName,
            file_size: photo.file.size,
            mime_type: photo.file.type,
            uploaded_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (photoError) throw photoError
      uploadedPhotos.push(photoData)
    }

    return { data: uploadedPhotos, error: null }
  } catch (error) {
    console.error('Error uploading photos:', error)
    return { data: null, error }
  }
}

export async function getInspections(inspectorId = null, limit = 50, offset = 0) {
  try {
    let query = supabase
      .from('inspections')
      .select(`
        *,
        profiles!inspector_id (
          first_name,
          last_name,
          email
        ),
        cases!case_id (
          case_number,
          claim_number,
          insurance_company,
          client_name,
          loss_date,
          property_address,
          property_city,
          property_state,
          property_zip,
          loss_type
        ),
        inspection_items (
          item_category,
          item_type,
          item_description,
          room_location,
          damage_type,
          damage_severity,
          damage_description,
          repair_recommendation,
          replacement_needed
        ),
        photos (
          id,
          file_name,
          file_path
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (inspectorId) {
      query = query.eq('inspector_id', inspectorId)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching inspections:', error)
    return { data: null, error }
  }
}

export async function getInspectionById(id) {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .select(`
        *,
        profiles!inspector_id (
          first_name,
          last_name,
          email
        ),
        cases!case_id (
          case_number,
          claim_number,
          insurance_company,
          client_name,
          loss_date,
          property_address,
          property_city,
          property_state,
          property_zip,
          loss_type
        ),
        inspection_items (
          item_category,
          item_type,
          item_description,
          room_location,
          damage_type,
          damage_severity,
          damage_description,
          repair_recommendation,
          replacement_needed
        ),
        photos (
          id,
          file_name,
          file_path,
          file_size,
          mime_type,
          uploaded_at
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching inspection:', error)
    return { data: null, error }
  }
}

export async function updateInspection(id, updates) {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating inspection:', error)
    return { data: null, error }
  }
}

export async function deleteInspection(id) {
  try {
    // First delete associated photos from storage and database
    const { data: photos } = await supabase
      .from('photos')
      .select('file_path')
      .eq('inspection_id', id)

    if (photos && photos.length > 0) {
      // Delete from storage
      const filePaths = photos.map(photo => photo.file_path)
      await supabase.storage
        .from('inspection-photos')
        .remove(filePaths)

      // Delete from database
      await supabase
        .from('photos')
        .delete()
        .eq('inspection_id', id)
    }

    // Delete inspection items
    await supabase
      .from('inspection_items')
      .delete()
      .eq('inspection_id', id)

    // Delete inspection record
    const { data, error } = await supabase
      .from('inspections')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error deleting inspection:', error)
    return { data: null, error }
  }
}

export async function getInspectionStats(inspectorId = null) {
  try {
    let query = supabase
      .from('inspections')
      .select('status', { count: 'exact' })

    if (inspectorId) {
      query = query.eq('inspector_id', inspectorId)
    }

    const { data, count, error } = await query

    if (error) throw error

    const stats = {
      total: count || 0,
      draft: 0,
      submitted: 0,
      under_review: 0,
      completed: 0
    }

    if (data) {
      data.forEach(inspection => {
        if (Object.prototype.hasOwnProperty.call(stats, inspection.status)) {
          stats[inspection.status]++
        }
      })
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error('Error fetching inspection stats:', error)
    return { data: null, error }
  }
}