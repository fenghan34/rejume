import MonacoEditor, { EditorProps, useMonaco } from '@monaco-editor/react'
import { useEffect } from 'react'


export const Editor = (props:
  Pick<EditorProps, 'value' | 'onChange' | 'className'>) => {
  const monaco = useMonaco()

    useEffect(() => {
      if (monaco) {
        console.log('here is the monaco instance:', monaco.editor)
      }
    }, [monaco])

  return (
    <MonacoEditor
      {...props}
      language="markdown"
      theme="vs-dark"
      options={{
        fontSize: 16,
        lineHeight: 1.5,
        wordWrap: 'on',
        padding: { top: 10, bottom: 10 },

      }}
    />
  )
}
