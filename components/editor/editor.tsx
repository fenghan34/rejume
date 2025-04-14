import type { OnMount } from '@monaco-editor/react'
import CodeEditor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from '@/providers/app'
import { setUpSpellcheck } from './spellcheck'
import { setUpAssistant } from './writing-assistant'

export function Editor() {
  const { theme } = useTheme()
  const [resumeId, resumeContent, updateResume, setMonacoEditor] = useAppStore(
    useShallow((state) => [
      state.resume.id,
      state.resume.content,
      state.updateResume,
      state.setMonacoEditor,
    ]),
  )

  const handleOnMount = useCallback<OnMount>((editor, monaco) => {
    setMonacoEditor(monaco, editor)
    setUpSpellcheck(editor, monaco, { lang: 'en_us' })
    setUpAssistant(editor, monaco)
  }, [])

  return (
    <CodeEditor
      value={resumeContent}
      language="markdown"
      theme={theme === 'light' ? 'vs' : 'vs-dark'}
      onMount={handleOnMount}
      onChange={(value) => updateResume(resumeId, { content: value || '' })}
      options={{
        fontSize: 15,
        wordWrap: 'on',
        padding: { top: 15, bottom: 200 },
        lineNumbers: 'off',
        automaticLayout: true,
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        minimap: {
          enabled: true,
          autohide: true,
        },
      }}
    />
  )
}
