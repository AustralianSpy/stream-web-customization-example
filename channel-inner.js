import React from 'react'
import {
  Window,
  MessageList,
  MessageInput,
  useChannelActionContext,
} from 'stream-chat-react'
import { useFeatureFlags, flags } from 'lib/feature-flags'
import ChannelHeader from './channel-header'
import { prepareCustomAttachment, setUploadButtonDisplay } from './utils'
import { useAttachmentContext } from './use-attachment-context'
import UserMessageInput from './components/user-message-input'

/* Encapsulates the inner-workings of the channel, including the send message functionality. */
export default function ChannelInner() {
  const { sendMessage } = useChannelActionContext()
  const { setSharing, sharing, shared, attType, id } = useAttachmentContext()
  const [allowCustomAttachments] = useFeatureFlags([
    flags.FLAG_FEAT_STREAM_CUSTOM_ATTACHMENTS,
  ])

  const overrideSubmitHandler = message => {
    if (sharing) {
      const customAttachment = prepareCustomAttachment({
        shared: shared,
        attType: attType,
        id: id,
      })
      message.attachments = [customAttachment]
    }

    // Check if we are allowed to send custom attachments. Send message as normal after.
    if (sharing && !allowCustomAttachments) {
      message.attachments = []
    }

    const updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    }

    if (sendMessage) {
      // Make sure context knows we are no longer sharing a custom attachment once
      // the message sends, and reveal the upload button once more.
      sendMessage(updatedMessage).then(() => {
        setSharing(false)
        setUploadButtonDisplay('block')
      })
    }
  }

  return (
    <Window>
      <ChannelHeader />
      <MessageList style={{ textAlign: 'left !important' }} />
      <MessageInput
        focus={false}
        Input={UserMessageInput}
        overrideSubmitHandler={overrideSubmitHandler}
      />
    </Window>
  )
}
