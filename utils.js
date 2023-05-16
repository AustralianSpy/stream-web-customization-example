export const OUR_TYPES = [
  'a',
  'be',
  'c',
  'd',
]

/* Controls the visibility of the attachment upload button, for purposes of hiding it when sharing a custom attachment. */
export function setUploadButtonDisplay(display) {
  const doc = document.documentElement
  doc.style.setProperty('--button-visibility', display)
}

export function checkForCustomAttachment(imageUploads) {
  if (Object.keys(imageUploads).length > 0) {
    const uploads = Object.values(imageUploads)
    if (!uploads.some(upload => OUR_TYPES.includes(upload.file.name))) {
      return false
    }
  } else {
    return false
  }
  return true
}

/* Prepares the data object sent to Stream for custom attachments. */
export function prepareCustomAttachment({ shared, attType, id }) {
  switch (attType) {
    case 'a':
      return {
        type: 'a_type',
        title: 'A',
        a_id: id,
        a_url: shared,
      }
    case 'b_type':
      return {
        type: 'b_type',
        title: 'B',
        b_id: id,
        b_url: shared,
      }
    default:
      return null
  }
}

/* Prepares the thumbnail image preview for a custom attachment. */
export async function prepareAttachmentPreview({ attType, id }) {
  let url
  switch (attType) {
    case 'a':
      url =
        'https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3'
      break
    case 'b':
      url =
        'https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/77/8d/0d/778d0dfe-71d4-f568-6aae-2cc1d8cf5395/source/512x512bb.jpg'
      break
    default:
      url =
        'https://thumbs.dreamstime.com/b/logout-eyeball-glossy-elegant-blue-round-button-abstract-illustration-228354712.jpg'
  }

  const imageFile = await fetch(url).then(async response => {
    const blob = await response.blob()
    return new File([blob], attType, { type: 'image/png' })
  })

  return {
    file: imageFile,
    id: id,
    url: url,
  }
}
