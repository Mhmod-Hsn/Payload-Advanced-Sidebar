'use client'

import type { NavGroupType } from '@payloadcms/ui/shared'

import { getTranslation } from '@payloadcms/translations'
import { Link, useConfig, useTranslation } from '@payloadcms/ui'
import { EntityType, formatAdminURL } from '@payloadcms/ui/shared'
import { ChevronDown, ChevronRight, Home } from 'lucide-react'
import { useEffect, useState } from 'react'
// @ts-ignore
import { usePathname } from 'next/navigation'

import { getNavIcon } from './get-nav-icon.js'
import { getActiveGroup, getSortedGroups } from './nav-utils.js'

type NavProps = {
  groups: NavGroupType[]
  groupsConfig?: Record<string, { icon?: string }>
  itemsConfig?: Record<string, { icon?: string }>
}

const baseClass = 'nav'

export const NavClient = ({ groups, groupsConfig, itemsConfig }: NavProps) => {
  const pathname = usePathname()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const { i18n } = useTranslation()

  const activeGroupSlug = getActiveGroup(pathname, adminRoute)
  const sortedGroups = getSortedGroups(groups)

  const [openGroups, setOpenGroups] = useState<string[]>([])

  useEffect(() => {
    const activeNavGroup = sortedGroups.find((g) =>
      g.entities.some((e) => e.slug === activeGroupSlug),
    )
    if (activeNavGroup && !openGroups.includes(activeNavGroup.label)) {
      setOpenGroups((prev) => [...prev, activeNavGroup.label])
    }
  }, [activeGroupSlug, sortedGroups])

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label],
    )
  }

  return (
    <div className="menu">
      <li className="group">
        <Link
          className={`${baseClass}__link group-toggle ${pathname === adminRoute ? 'active' : ''}`}
          href={adminRoute}
        >
          <Home size={16} />
          {'Home'}
        </Link>
      </li>
      {sortedGroups.map(({ entities, label: groupLabel }: NavGroupType, key: number) => {
        const groupSlug = groupLabel.toLowerCase()
        const Icon = getNavIcon(groupSlug, groupsConfig)
        const isOpen = openGroups.includes(groupLabel)

        return (
          <li className="group" key={key}>
            <div
              className={`${baseClass}__link group-toggle`}
              onClick={() => toggleGroup(groupLabel)}
              style={{ cursor: 'pointer' }}
            >
              {Icon && <Icon size={16} />}
              {getTranslation(groupLabel, i18n)}
              <div className="group-chevron">
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </div>
            {isOpen &&
              entities.map(({ slug, type, label }: any) => {
                let href: null | string = null
                if (type === EntityType.collection) {
                  href = formatAdminURL({
                    adminRoute,
                    path: `/collections/${slug}`,
                  })
                } else if (type === EntityType.global) {
                  href = formatAdminURL({
                    adminRoute,
                    path: `/globals/${slug}`,
                  })
                }
                const ItemIcon = getNavIcon(slug, itemsConfig)

                return (
                  <Link
                    className={`${baseClass}__link sub-group-list ${pathname === href ? 'active' : ''}`}
                    href={href || ''}
                    key={slug}
                  >
                    <div style={{ alignItems: 'center', display: 'flex', gap: '6px' }}>
                      {ItemIcon && <ItemIcon size={14} />}
                      {getTranslation(label, i18n)}
                    </div>
                  </Link>
                )
              })}
          </li>
        )
      })}
    </div>
  )
}
