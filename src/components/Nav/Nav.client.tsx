'use client'

import type { NavGroupType } from '@payloadcms/ui/shared'

import { getTranslation } from '@payloadcms/translations'
import { Link, useConfig, useTranslation } from '@payloadcms/ui'
import { EntityType, formatAdminURL } from '@payloadcms/ui/shared'
import { ChevronDown, ChevronRight, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { getNavIcon } from './get-nav-icon'
import { getActiveGroup, getSortedGroups } from './nav-utils'

type NavProps = {
  animations?: boolean
  groups: NavGroupType[]
  groupsConfig?: Record<string, { icon?: string }>
  itemsConfig?: Record<string, { icon?: string }>
}

const baseClass = 'nav'

let persistedOpenGroups: string[] = []

export const NavClient = ({ animations = true, groups, groupsConfig, itemsConfig }: NavProps) => {
  const pathname = usePathname()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const { i18n } = useTranslation()

  const activeGroupSlug = getActiveGroup(pathname, adminRoute)
  const sortedGroups = getSortedGroups(groups)

  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    const initialGroups = [...persistedOpenGroups]
    const activeNavGroup = sortedGroups.find((g) =>
      g.entities.some((e) => e.slug === activeGroupSlug),
    )

    if (activeNavGroup && !initialGroups.includes(activeNavGroup.label)) {
      initialGroups.push(activeNavGroup.label)
    }

    return initialGroups
  })

  useEffect(() => {
    persistedOpenGroups = openGroups
  }, [openGroups])

  useEffect(() => {
    const activeNavGroup = sortedGroups.find((g) =>
      g.entities.some((e) => e.slug === activeGroupSlug),
    )
    if (activeNavGroup && !openGroups.includes(activeNavGroup.label)) {
      setOpenGroups((prev) => [...prev, activeNavGroup.label])
    }
  }, [activeGroupSlug, sortedGroups, openGroups])

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
        if (!groupLabel) {
          return (
            <React.Fragment key={key}>
              {entities.map(({ slug, type, label, path }: any) => {
                let href: null | string = null
                if (type === EntityType.collection) {
                  href = formatAdminURL({ adminRoute, path: `/collections/${slug}` })
                } else if (type === EntityType.global) {
                  href = formatAdminURL({ adminRoute, path: `/globals/${slug}` })
                } else if (type === 'custom') {
                  href =
                    path.startsWith('/') && !path.startsWith(adminRoute)
                      ? `${adminRoute}${path}`
                      : path
                }
                const ItemIcon = getNavIcon(slug, itemsConfig)

                return (
                  <li className="group" key={slug}>
                    <Link
                      className={`${baseClass}__link group-toggle ${pathname === href ? 'active' : ''}`}
                      href={href || ''}
                    >
                      {ItemIcon && <ItemIcon size={16} />}
                      {getTranslation(label, i18n)}
                    </Link>
                  </li>
                )
              })}
            </React.Fragment>
          )
        }

        const Icon = getNavIcon(groupLabel, groupsConfig)
        const isOpen = openGroups.includes(groupLabel)
        const ChevronIcon = !animations && isOpen ? ChevronDown : ChevronRight

        return (
          <li className="group" key={key}>
            <div
              className={`${baseClass}__link group-toggle`}
              onClick={() => toggleGroup(groupLabel)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleGroup(groupLabel)
                }
              }}
              role="button"
              style={{ cursor: 'pointer' }}
              tabIndex={0}
            >
              {Icon && <Icon size={16} />}
              {getTranslation(groupLabel, i18n)}
              <div className="group-chevron">
                <ChevronIcon
                  className={animations ? `chevron animated ${isOpen ? 'open' : ''}` : undefined}
                  size={16}
                />
              </div>
            </div>
            <div
              className={`sub-group-wrapper ${isOpen ? 'open' : ''} ${animations ? 'animated' : ''}`}
            >
              <div className="sub-group-inner">
                {entities.map(({ slug, type, label, path }: any) => {
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
                  } else if (type === 'custom') {
                    href =
                      path.startsWith('/') && !path.startsWith(adminRoute)
                        ? `${adminRoute}${path}`
                        : path
                  }
                  const ItemIcon = getNavIcon(slug, itemsConfig)

                  return (
                    <Link
                      className={`${baseClass}__link sub-group-list ${pathname === href ? 'active' : ''}`}
                      href={href || ''}
                      key={slug}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      <div style={{ alignItems: 'center', display: 'flex', gap: '6px' }}>
                        {ItemIcon && <ItemIcon size={14} />}
                        {getTranslation(label, i18n)}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </li>
        )
      })}
    </div>
  )
}
