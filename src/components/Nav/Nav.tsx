import type { EntityToGroup } from '@payloadcms/ui/shared'
import type { ServerProps } from 'payload'

import { Logout } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'

import { NavClient } from './Nav.client'
import './Nav.css'
import { NavWrapper } from './NavWrapper'

const baseClass = 'nav'

import type { CustomNavLink } from '../../index'

type NavProps = {
  animations?: boolean
  groupsConfig?: Record<string, { icon?: string }>
  itemsConfig?: Record<string, { icon?: string }>
  navLinks?: CustomNavLink[]
} & ServerProps

const Nav = (props: NavProps) => {
  const {
    animations,
    documentSubViewType,
    groupsConfig,
    i18n,
    itemsConfig,
    locale,
    navLinks,
    params,
    payload,
    permissions,
    searchParams,
    user,
    viewType,
    visibleEntities,
  } = props
  const {
    admin: {
      components: { afterNavLinks, beforeNavLinks, logout },
    },
    collections,
    globals,
  } = payload.config
  const LogoutComponent = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: logout?.Button,
    Fallback: Logout,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const groups = groupNavItems(
    [
      ...collections
        .filter(({ slug }) => visibleEntities?.collections.includes(slug))
        .map(
          (collection) =>
            ({
              type: EntityType.collection,
              entity: collection,
            }) satisfies EntityToGroup,
        ),
      ...globals
        .filter(({ slug }) => visibleEntities?.globals.includes(slug))
        .map(
          (global) =>
            ({
              type: EntityType.global,
              entity: global,
            }) satisfies EntityToGroup,
        ),
    ],
    permissions as any,
    i18n,
  )

  const mergedItemsConfig = { ...(itemsConfig || {}) }

  if (navLinks && navLinks.length > 0) {
    navLinks.forEach((link) => {
      const groupLabel = link.group || ''
      let targetGroup = groups.find((g) => g.label === groupLabel)

      if (!targetGroup) {
        targetGroup = {
          entities: [],
          label: groupLabel,
        }
        groups.push(targetGroup)
      }

      const linkSlug = link.slug || link.path

      targetGroup.entities.push({
        slug: linkSlug,
        type: 'custom' as any,
        label: link.label,
        path: link.path,
      } as any)

      if (link.icon) {
        mergedItemsConfig[linkSlug] = { icon: link.icon }
      }
    })
  }

  return (
    <NavWrapper baseClass={baseClass}>
      {RenderServerComponent({
        clientProps: {
          documentSubViewType,
          viewType,
        },
        Component: beforeNavLinks,
        importMap: payload.importMap,
        serverProps: {
          i18n,
          locale,
          params,
          payload,
          permissions,
          searchParams,
          user,
        },
      })}
      <NavClient
        animations={animations}
        groups={groups}
        groupsConfig={groupsConfig}
        itemsConfig={mergedItemsConfig}
      />
      {RenderServerComponent({
        clientProps: {
          documentSubViewType,
          viewType,
        },
        Component: afterNavLinks,
        importMap: payload.importMap,
        serverProps: {
          i18n,
          locale,
          params,
          payload,
          permissions,
          searchParams,
          user,
        },
      })}
      <div className={`${baseClass}__controls`}>{LogoutComponent}</div>
    </NavWrapper>
  )
}

export default Nav
