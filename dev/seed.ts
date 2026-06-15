import type { Payload } from 'payload'

import { devUser } from './helpers/credentials'

export const seed = async (payload: Payload) => {
  const { totalDocs } = await payload.count({
    collection: 'users',
    where: {
      email: {
        equals: devUser.email,
      },
    },
  })

  if (!totalDocs) {
    await payload.create({
      collection: 'users',
      data: devUser,
    })

    // Seed dummy data for sidebar groups
    await payload.create({ collection: 'posts', data: { title: 'Welcome to Payload' } })
    await payload.create({ collection: 'posts', data: { title: 'Advanced Sidebar Plugin' } })
    await payload.create({ collection: 'analytics', data: { metric: 'Page Views', value: 1200 } })
    await payload.create({ collection: 'analytics', data: { metric: 'Unique Visitors', value: 450 } })
    await payload.create({ collection: 'customers', data: { name: 'Alice Smith' } })
    await payload.create({ collection: 'customers', data: { name: 'Bob Jones' } })
    await payload.create({ collection: 'orders', data: { total: 199.99 } })
    await payload.create({ collection: 'custom-data', data: { info: 'Special group config test' } })
  }
}
