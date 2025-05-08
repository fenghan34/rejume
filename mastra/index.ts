import { createLogger } from '@mastra/core/logger'
import { Mastra } from '@mastra/core/mastra'
import { LibSQLStore } from '@mastra/libsql'
import agents from './agents'

export const mastra = new Mastra({
  agents,
  storage: new LibSQLStore({
    url: ':memory:',
  }),
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
})
