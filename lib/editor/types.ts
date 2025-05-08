import type * as monaco from 'monaco-editor'

export type { IRange, Position } from 'monaco-editor'

export type Monaco = typeof monaco
export type MonacoEditor = monaco.editor.IStandaloneCodeEditor
export type ContentWidget = monaco.editor.IContentWidget
export type IMarkerData = monaco.editor.IMarkerData
export type CodeActionProvider = monaco.languages.CodeActionProvider
export type CodeAction = monaco.languages.CodeAction
