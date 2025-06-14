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
            policy_holder: inspectionData.policyHolder,
            date_of_loss: inspectionData.dateOfLoss,
            property_address: inspectionData.propertyAddress
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
          inspection_type: 'damage_assessment', // Default type
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
      .from('inspection_details')
      .insert([
        {
          inspection_id: inspection.id,
          item_category: inspectionData.itemCategory,
          item_description: inspectionData.itemDescription,
          item_age: inspectionData.itemAge,
          item_condition_before: inspectionData.itemConditionBefore,
          damage_description: inspectionData.damageDescription,
          damage_types: inspectionData.damageType || [],
          room_location: inspectionData.roomLocation
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
      const { data: urlData } = supabase.storage
        .from('inspection-photos')
        .getPublicUrl(fileName)

      // Save photo record to database
      const { data: photoData, error: photoError } = await supabase
        .from('inspection_photos')
        .insert([
          {
            inspection_id: inspectionId,
            file_name: photo.file.name,
            file_path: fileName,
            file_url: urlData.publicUrl,
            file_size: photo.file.size,
            file_type: photo.file.type,
            created_at: new Date().toISOString()
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
        user_profiles!inspector_id (
          first_name,
          last_name,
          email
        ),
        cases!case_id (
          case_number,
          claim_number,
          insurance_company,
          policy_holder,
          date_of_loss,
          property_address
        ),
        inspection_details (
          item_category,
          item_description,
          item_age,
          item_condition_before,
          damage_description,
          damage_types,
          room_location
        ),
        inspection_photos (
          id,
          file_name,
          file_url
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
        user_profiles!inspector_id (
          first_name,
          last_name,
          email
        ),
        cases!case_id (
          case_number,
          claim_number,
          insurance_company,
          policy_holder,
          date_of_loss,
          property_address
        ),
        inspection_details (
          item_category,
          item_description,
          item_age,
          item_condition_before,
          damage_description,
          damage_types,
          room_location
        ),
        inspection_photos (
          id,
          file_name,
          file_url,
          file_size,
          file_type,
          created_at
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
      .from('inspection_photos')
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
        .from('inspection_photos')
        .delete()
        .eq('inspection_id', id)
    }

    // Delete inspection details
    await supabase
      .from('inspection_details')
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