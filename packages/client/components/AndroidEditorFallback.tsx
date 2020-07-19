import {EditorState} from 'draft-js'
import React, {RefObject, useEffect, useState} from 'react'
import styled from '@emotion/styled'
import TextArea from 'react-textarea-autosize'
import {Card, Gutters} from '../types/constEnums'
import {PALETTE} from '../styles/paletteV2'

interface Props {
  className?: string
  editorState: EditorState
  onBlur?: (e: React.FocusEvent) => void
  onFocus?: (e: React.FocusEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder: string
  editorRef: RefObject<HTMLTextAreaElement>
  onChange?: () => void
}

const TextAreaStyles = styled(TextArea)({
  backgroundColor: 'transparent',
  border: 0,
  color: PALETTE.TEXT_MAIN,
  display: 'block',
  fontSize: Card.FONT_SIZE,
  lineHeight: Card.LINE_HEIGHT,
  overflow: 'hidden',
  outline: 0,
  padding: `${Gutters.REFLECTION_INNER_GUTTER_VERTICAL} ${Gutters.REFLECTION_INNER_GUTTER_HORIZONTAL}`,
  resize: 'none',
  width: '100%'
})

const AndroidEditorFallback = (props: Props) => {
  const {className, editorState, onBlur, onFocus, onKeyDown, placeholder, editorRef} = props
  const [value, setValue] = useState('')
  const [height, setHeight] = useState<number | undefined>(44)

  useEffect(() => {
    const currentContent = editorState.getCurrentContent()
    const text = currentContent.getPlainText()
    setValue(text)
  }, [editorState])

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  return (
    <TextAreaStyles
      className={className}
      onHeightChange={(height) => setHeight(height)}
      style={{height}}
      inputRef={editorRef}
      spellCheck
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    />
  )
}

export default AndroidEditorFallback
