import React, { useEffect, useState } from 'react'
import { useMessageInputContext, MessageInputFlat } from 'stream-chat-react'
import {
  OUR_TYPES,
  prepareAttachmentPreview,
  setUploadButtonDisplay,
} from '../utils'
import { useAttachmentContext } from '../use-attachment-context'

/* Input field that handles previews for our custom attachments. */
export default function UserMessageInput() {
  const { shared, attType, id, sharing, setSharing } = useAttachmentContext()
  const { imageUploads, imageOrder, uploadImage } = useMessageInputContext()
  const [uploadCompleted, setUploadCompleted] = useState(false)

  useEffect(() => {
    if (sharing) {
      const getAttachmentData = async () => {
        const customAttachment = await prepareAttachmentPreview({
          shared: shared,
          attType: attType,
          id: id,
        })

        // Add the preview to the image uploads/image order mapping for render.
        imageUploads[id] = customAttachment
        uploadImage && uploadImage(id)
        imageOrder[0] = id
        // Hide the upload attachments button to prevent sending multiple attachments.
        setUploadButtonDisplay('none')
      }

      getAttachmentData()
        .then(() => setUploadCompleted(true))
        .catch(e => console.log(e))
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [sharing])

  // We can't attach a listener to the remove-upload function.
  // We have to manually check on a re-render whether or not the custom attachment
  // is still in the preview set. If it was removed, we are not sharing. Set state and button visibility.
  useEffect(() => {
    if (sharing) {
      if (uploadCompleted) {
        if (Object.keys(imageUploads).length > 0) {
          const uploads = Object.values(imageUploads)
          if (!uploads.some(upload => OUR_TYPES.includes(upload.file.name))) {
            setSharing(false)
            setUploadButtonDisplay('block')
          }
        } else {
          setSharing(false)
          setUploadButtonDisplay('block')
        }
      }
    }
  }, [sharing, imageUploads, setSharing, uploadCompleted])

  return <MessageInputFlat />
}
