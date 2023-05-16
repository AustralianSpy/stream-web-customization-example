import React from 'react'
import { Attachment, ImageComponent, Card } from 'stream-chat-react'
import { useFeatureFlags, flags } from 'lib/feature-flags'
import { useAuth } from 'lib/auth'
import AAttachmentCard from './group-event-attachment-card'
import BAttachmentCard from './lesson-type-attachment-card'

/* Component to render our custom attachments per-type. */
const UpdatedCard = props => {
  const { isCoach } = useAuth()
  const [allowCustomAttachments] = useFeatureFlags([
    flags.FLAG_FEAT_STREAM_CUSTOM_ATTACHMENTS,
  ])

  switch (props?.type) {
    case 'a':
      return allowCustomAttachments ? (
        <AAttachmentCard {...props} />
      ) : null
    case 'b':
      return allowCustomAttachments ? (
        <BAttachmentCard {...props} />
      ) : null
    default:
      return <Card {...props} />
  }
}

/* Note that Stream for web encapsulates all non-standard attachment types as a Card. */
/* For that reason, our UpdatedCard is attached to the Card prop on the Attachment component. */
export default function CustomAttachment(props) {
  return <Attachment {...props} Card={UpdatedCard} />
}
