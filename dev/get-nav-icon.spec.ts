import { describe, expect, test } from 'vitest'

import { getNavIcon } from '../src/components/Nav/get-nav-icon'

describe('getNavIcon', () => {
  test('resolves exact group labels', () => {
    expect(getNavIcon('E-Mails', { 'E-Mails': { icon: 'Timer' } })).toBeDefined()
  })

  test('keeps backwards compatibility with lower-case group keys', () => {
    expect(getNavIcon('E-commerce', { 'e-commerce': { icon: 'ShoppingCart' } })).toBeDefined()
  })

  test('resolves item slugs without changing them', () => {
    expect(getNavIcon('announcements', { announcements: { icon: 'Timer' } })).toBeDefined()
  })

  test('ignores unknown icon names', () => {
    expect(getNavIcon('E-Mails', { 'E-Mails': { icon: 'NotARealIcon' } })).toBeUndefined()
  })
})
