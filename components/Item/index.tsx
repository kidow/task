import type { FC, MouseEventHandler } from 'react'
import classnames from 'classnames'
import { supabase, useComponentDidUpdate, useObjectState } from 'services'
import { DebounceInput } from 'react-debounce-input'
import { XIcon } from '@heroicons/react/outline'

export interface Props extends Table.Tasks {
  onUpdate: () => void
  isLoggedIn: boolean
}
interface State {
  isOpen: boolean
  title: string
  description: string
}

const Item: FC<Props> = ({
  is_resolved,
  onUpdate,
  id,
  isLoggedIn,
  ...props
}) => {
  const [{ isOpen, description, title }, setState, onChange] =
    useObjectState<State>({
      isOpen: false,
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

  useComponentDidUpdate(() => {
    update()
  }, [title, description])
  return (
    <div>
      <div
        onClick={() => setState({ isOpen: !isOpen })}
        className={classnames(
          'flex cursor-pointer items-center p-2 duration-150 hover:bg-neutral-800 active:bg-neutral-700',
          { 'text-neutral-600': is_resolved }
        )}
      >
        {isLoggedIn && (
          <button onClick={remove}>
            <XIcon className="mr-2 h-5 w-5 text-neutral-400 hover:text-neutral-50" />
          </button>
        )}
        <DebounceInput
          className="w-full flex-1 select-none truncate read-only:cursor-pointer"
          readOnly={is_resolved}
          value={title}
          placeholder="타이틀 수정"
          spellCheck={false}
          name="title"
          debounceTimeout={1000}
          onChange={onChange}
        />
        <button
          onClick={onResolve}
          className={classnames(
            'h-5 w-5 rounded-full border border-neutral-700 duration-150',
            {
              'relative bg-neutral-700 before:absolute before:left-1.5 before:top-1 before:h-2 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-neutral-400':
                is_resolved
            }
          )}
        />
      </div>
      {isOpen && (
        <div className="mb-2 px-2">
          <DebounceInput
            value={description}
            name="description"
            className={classnames('w-full text-sm', {
              'text-neutral-600': is_resolved
            })}
            placeholder="내용 수정"
            readOnly={is_resolved}
            onChange={onChange}
            debounceTimeout={1000}
            spellCheck={false}
          />
        </div>
      )}
    </div>
  )
}

export default Item
