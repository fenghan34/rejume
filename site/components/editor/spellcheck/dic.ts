import { loadModule } from 'hunspell-asm'
import ky from 'ky'

const DicSources = {
  en_us: {
    aff: 'https://raw.githubusercontent.com/wooorm/dictionaries/refs/heads/main/dictionaries/en/index.aff',
    dic: 'https://raw.githubusercontent.com/wooorm/dictionaries/refs/heads/main/dictionaries/en/index.dic',
  },
} as const

export type Language = keyof typeof DicSources

export interface Dictionary {
  check: (word: string) => boolean
  suggest: (word: string) => string[]
  addWord: (word: string) => void
  dispose: () => void
}

export async function initDictionary(language: Language): Promise<Dictionary> {
  const source = DicSources[language]
  const buffers = await Promise.all([source.aff, source.dic].map(url => ky(url).arrayBuffer()))

  const hunspellFactory = await loadModule()

  const [affPath, dicPath] = buffers.map((buffer, index) => hunspellFactory.mountBuffer(new Uint8Array(buffer), `${language}.${['aff', 'dic'][index]}`))

  const hunspell = hunspellFactory.create(affPath, dicPath)

  return {
    check: hunspell.spell,
    suggest: hunspell.suggest,
    addWord: hunspell.addWord,
    dispose: hunspell.dispose
  }
}
