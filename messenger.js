import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import { Channel, ChannelList, useChatContext } from 'stream-chat-react'
import { withStreamClient } from 'lib/stream-messaging'
import { useDebounce, useMobileHeight } from 'lib/hooks'
import ChannelPreview from './channel-preview'
import ChannelInner from './channel-inner'
import NewConversationDialog from './new-conversation-dialog'
import EmptyChannel from './empty-channel'
import { AttachmentContextProvider } from './use-attachment-context'
import CustomAttachment from './attachments'

const ChannelListHeader = React.memo(({ searchQuery, setSearchQuery }) => {
  return (
    <Box display="flex" position="relative" p={2} alignItems="center">
      <Box display="flex" flexGrow={1} mr={2} bgcolor="white" borderRadius={4}>
        <TextField
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          color="primary"
          variant="outlined"
          margin="none"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <NewConversationDialog
        trigger={
          <IconButton color="primary">
            <AddOutlinedIcon />
          </IconButton>
        }
      />
    </Box>
  )
})

const Messenger = withStreamClient(() => {
  const { channelId: initialChannelId } = useParams()
  const { path } = useRouteMatch()
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [displayChannelList, setDisplayChannelList] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)?.trim()
  const { channel, client, setActiveChannel } = useChatContext()
  useMobileHeight()

  const MemoizedChannelListHeader = useCallback(
    () => (
      <ChannelListHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    ),
    [searchQuery, setSearchQuery],
  )

  useEffect(() => {
    if (!displayChannelList) {
      const hasChannels = async () => {
        const channels = await client.queryChannels(filters, sort, { limit: 1 })
        setDisplayChannelList(channels.length > 0)
      }

      hasChannels()
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [channel])

  // if channelId parameter is provided, select the corresponding channel on load
  useEffect(() => {
    if (initialChannelId != null) {
      const updateActiveChannel = async () => {
        const filter = { id: initialChannelId }
        const sort = []
        const [ch] = await client.queryChannels(filter, sort, { limit: 1 })
        if (ch != null) {
          setActiveChannel(ch)
        }
      }

      updateActiveChannel()
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

  // update browser url to match selected channel whenever it changes
  useEffect(() => {
    if (channel != null && path.includes(':channelId?')) {
      window.history.replaceState(
        null,
        null,
        path.replace(':channelId?', channel.id),
      )
    }
  }, [channel, path])

  return displayChannelList ? (
    <>
      <ChannelList
        filters={filters}
        sort={sort}
        options={options}
        showChannelSearch
        Preview={ChannelPreview}
        ChannelSearch={MemoizedChannelListHeader}
        setActiveChannelOnMount={!initialChannelId}
      />
      {channel && (
        <AttachmentContextProvider>
          <Channel channel={channel} Attachment={CustomAttachment}>
            <ChannelInner />
          </Channel>
        </AttachmentContextProvider>
      )}
    </>
  ) : (
    <EmptyChannel />
  )
})

export default Messenger
