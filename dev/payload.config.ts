import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import path from 'path'
import { buildConfig } from 'payload'
import { advancedSidebarPlugin } from 'payload-advanced-sidebar'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { devUser } from "./helpers/credentials";
import { testEmailAdapter } from './helpers/testEmailAdapter'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const globalWithMemoryDB = globalThis as {
  __payloadAdvancedSidebarMemoryDB?: Promise<MongoMemoryReplSet>
} & typeof globalThis

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

const buildConfigWithMemoryDB = async () => {
  if (process.env.NODE_ENV === 'test' || process.env.PAYLOAD_MEMORY_DB === '1') {
    globalWithMemoryDB.__payloadAdvancedSidebarMemoryDB ??= MongoMemoryReplSet.create({
      replSet: {
        count: 3,
        dbName: 'payloadmemory',
      },
    })

    const memoryDB = await globalWithMemoryDB.__payloadAdvancedSidebarMemoryDB
    process.env.DATABASE_URL = `${memoryDB.getUri()}&retryWrites=true`
  }

  return buildConfig({
    admin: {
      autoLogin: {
        email: devUser.email,
        password: devUser.password,
      },
      importMap: {
        baseDir: path.resolve(dirname),
      }
    },
    collections: [
      {
        slug: 'posts',
        admin: { group: 'Content' },
        fields: [{ name: 'title', type: 'text' }],
      },
      {
        slug: 'media',
        admin: { group: 'Content' },
        fields: [],
        upload: {
          staticDir: path.resolve(dirname, 'media'),
        },
      },
      {
        slug: 'analytics',
        admin: { group: 'Analytics' },
        fields: [
          { name: 'metric', type: 'text' },
          { name: 'value', type: 'number' },
        ],
      },
      {
        slug: 'customers',
        admin: { group: 'E-commerce' },
        fields: [{ name: 'name', type: 'text' }],
      },
      {
        slug: 'orders',
        admin: { group: 'E-commerce' },
        fields: [{ name: 'total', type: 'number' }],
      },
      {
        slug: 'custom-data',
        admin: { group: 'My Group' },
        fields: [{ name: 'info', type: 'text' }],
      },
    ],
    db: mongooseAdapter({
      ensureIndexes: true,
      url: process.env.DATABASE_URL || '',
    }),
    editor: lexicalEditor(),
    email: testEmailAdapter,
    onInit: async (payload) => {
      await seed(payload)
    },
    plugins: [
      advancedSidebarPlugin({
        groups: {
          Content: {
            icon: 'LayoutDashboard',
          },
          'E-commerce': {
            icon: 'ShoppingCart',
          },
        },
        items: {
          analytics: {
            icon: 'BarChart3',
          },
          'custom-data': {
            icon: 'Code',
          },
          customers: {
            icon: 'Users',
          },
          media: {
            icon: 'FileImage',
          },
          orders: {
            icon: 'Package',
          },
          posts: {
            icon: 'Book',
          },
        },
      }),
    ],
    secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
    sharp,
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
  })
}

export default buildConfigWithMemoryDB()
