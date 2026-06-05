import type { EntityToGroup } from '@payloadcms/ui/shared'
import type { ServerProps } from 'payload'

import { Logout } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'

import { NavClient } from './Nav.client.js'
import './Nav.scss'
import { NavWrapper } from './NavWrapper.js'

const baseClass = 'nav'

type NavProps = {
  groupsConfig?: Record<string, { icon?: string }>
  itemsConfig?: Record<string, { icon?: string }>
} & ServerProps

const Nav = (props: NavProps) => {
  const {
    documentSubViewType,
    groupsConfig,
    i18n,
    itemsConfig,
    locale,
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
      <NavClient groups={groups} groupsConfig={groupsConfig} itemsConfig={itemsConfig} />
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
