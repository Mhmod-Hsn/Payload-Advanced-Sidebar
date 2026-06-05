import type { Config } from 'payload'

export type SidebarPluginConfig = {
  animations?: boolean
  enabled?: boolean
  groups?: Record<string, { icon?: string }>
  items?: Record<string, { icon?: string }>
}

export const advancedSidebarPlugin = (pluginConfig: SidebarPluginConfig = {}) => {
  return (config: Config): Config => {
    if (pluginConfig.enabled === false) {
      return config
    }

    config.admin = {
      ...(config.admin ?? {}),
      components: {
        ...(config.admin?.components ?? {}),
        Nav: {
          clientProps: {
            animations: pluginConfig.animations ?? true,
            groupsConfig: pluginConfig.groups,
            itemsConfig: pluginConfig.items,
          },
          path: 'payload-advanced-sidebar/rsc#NavWithGroups',
        },
      },
    }

    return config
  }
}

export default advancedSidebarPlugin
