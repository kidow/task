import type { FC, MouseEventHandler } from 'react'
import classnames from 'classnames'
import { supabase, useComponentDidUpdate, useObjectState } from 'services'
import { DebounceInput } from 'react-debounce-input'
import { ReplyIcon, XIcon } from '@heroicons/react/outline'
import isToday from 'dayjs/plugin/isToday'
import dayjs from 'dayjs'
dayjs.extend(isToday)

export interface Props extends Table.Tasks {
  onUpdate: (type?: 'today') => void
  isLoggedIn: boolean
  currentDate: string
}
interface State {
  title: string
  description: string
}

const Item: FC<Props> = ({
  is_resolved,
  onUpdate,
  id,
  isLoggedIn,
  currentDate,
  ...props
}) => {
  const [{ description, title }, setState, onChange] = useObjectState<State>({
    description: props.description || '',
    title: props.title
  })

  const update = async () => {
    try {
      await supabase
        .from<Table.Tasks>('tasks')
        .update({ title, description })
        .eq('id', id)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const remove: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation()
    if (!window.confirm('정말 지웁니까?')) return
    try {
      await supabase.from<Table.Tasks>('tasks').delete().eq('id', id)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const onResolve: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation()
    try {
      await supabase
        .from<Table.Tasks>('tasks')
        .update({ is_resolved: !is_resolved })
        .eq('id', id)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const onMoveToday: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation()
    if (!window.confirm('오늘 테스크로 옮기겠습니까?')) return
    try {
      await supabase
        .from<Table.Tasks>('tasks')
        .update({ created_at: new Date().toISOString() })
        .eq('id', id)
      onUpdate('today')
    } catch (err) {
      console.error(err)
    }
  }

  useComponentDidUpdate(() => {
    update()
  }, [title, description])
  return (
    <div>
      <div
        className={classnames(
          'flex cursor-pointer items-center p-2 duration-150 hover:bg-neutral-800 active:bg-neutral-700',
          { 'text-neutral-600': is_resolved, group: isLoggedIn }
        )}
      >
        <DebounceInput
          className="w-full flex-1 select-none truncate read-only:cursor-pointer"
          readOnly={is_resolved}
          value={title}
          placeholder="타이틀 수정"
          spellCheck={false}
          disabled={!isLoggedIn}
          name="title"
          debounceTimeout={1000}
          onChange={onChange}
        />
        {!dayjs(currentDate).isToday() && isLoggedIn && (
          <button
            onClick={onMoveToday}
            className="mr-2 hidden text-neutral-400 hover:text-neutral-500 group-hover:inline-block"
          >
            <ReplyIcon className="h-5 w-5" />
          </button>
        )}
        {isLoggedIn && (
          <button
            onClick={remove}
            className="mr-2 hidden text-neutral-400 hover:text-neutral-50 group-hover:inline-block"
          >
            <XIcon className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={onResolve}
          disabled={!isLoggedIn}
          className={classnames(
            'h-5 w-5 rounded-full border border-neutral-700 duration-150',
            {
              'relative bg-neutral-700 before:absolute before:left-1.5 before:top-1 before:h-2 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-neutral-400':
                is_resolved
            }
          )}
        />
      </div>
      <div className="mb-2 px-2">
        <DebounceInput
          value={description}
          name="description"
          className={classnames(
            'w-full rounded border border-transparent p-1 text-sm focus:border-neutral-600',
            { 'text-neutral-600 placeholder:text-neutral-600': is_resolved }
          )}
          placeholder="내용"
          readOnly={is_resolved}
          onChange={onChange}
          debounceTimeout={1000}
          disabled={!isLoggedIn}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

export default Item
