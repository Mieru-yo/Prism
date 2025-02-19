/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo } from 'react'
import type { NoteEntry } from '../../../../api/explore/types'
import Link from 'next/link'
import { NoteTypeIcon } from '../../../common/note-type-icon/note-type-icon'
import { NoteTags } from '../../note-tags/note-tags'
import { Dropdown } from 'react-bootstrap'
import { UiIcon } from '../../../common/icons/ui-icon'
import { ThreeDotsVertical as IconThreeDotsVertical } from 'react-bootstrap-icons'
import { UserAvatarForUsername } from '../../../common/user-avatar/user-avatar-for-username'
import { DeleteNoteMenuEntry } from './delete-note-menu-entry'
import { formatChangedAt } from '../../../../utils/format-date'
import { useApplicationState } from '../../../../hooks/common/use-application-state'
import { deleteNote } from '../../../../api/notes'
import { useUiNotifications } from '../../../notifications/ui-notification-boundary'

export const NoteListEntry: React.FC<NoteEntry> = ({
  primaryAddress,
  title,
  tags,
  type,
  lastChangedAt,
  isPinned,
  owner
}) => {
  const { showErrorNotification } = useUiNotifications()
  const lastChangedRelative = useMemo(() => formatChangedAt(lastChangedAt), [lastChangedAt])
  const currentUser = useApplicationState((state) => state.user)
  const onClickDeleteNote = useCallback(
    (keepMedia: boolean) => {
      deleteNote(primaryAddress, keepMedia).catch(showErrorNotification('explore.notesList.deleteNoteError', { title }))
    },
    [title, primaryAddress]
  )

  return (
    <div className={'border-top border-bottom py-3 d-flex align-items-center'}>
      <span className={'mx-2'}>
        <Link href={`/n/${primaryAddress}`} className={'text-light'}>
          <NoteTypeIcon noteType={type} size={3} />
        </Link>
      </span>
      <div className={'flex-grow-1'}>
        <Link href={`/n/${primaryAddress}`} className={'text-decoration-none text-light'}>
          {title}
        </Link>
        {tags.length > 0 && <br />}
        <NoteTags tags={tags} />
      </div>
      <div className={'me-4'}>
        <UserAvatarForUsername username={owner} />
        <br />
        <small className={'text-muted'}>{lastChangedRelative}</small>
      </div>
      <Dropdown>
        <Dropdown.Toggle variant={'secondary'} className={'no-arrow'}>
          <UiIcon icon={IconThreeDotsVertical} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <DeleteNoteMenuEntry
            noteTitle={title}
            isOwner={owner !== null && currentUser?.username === owner}
            onConfirm={onClickDeleteNote}
          />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
