# Payload Plugin Advanced Sidebar

A Payload CMS 3.0 plugin that gives you complete control over your admin sidebar navigation. Organize collections and globals into custom groups, add custom icons, and hide specific items with ease.

![Sidebar Preview](./images/sidebar-preview.png)

## Features

- 📁 **Custom Groups**: Organize your collections and globals into logical groups.
- 🎨 **Custom Icons**: Add Lucide React icons or your own custom icons to your navigation items.
- 👻 **Hide Items**: Easily hide specific collections or globals from the sidebar.
- 🔗 **External Links**: Add custom external links to your sidebar (if applicable).
- ⚙️ **Simple Configuration**: Easy to set up and configure directly from your Payload config.

## Installation

```bash
npm install payload-plugin-advanced-sidebar
# or
yarn add payload-plugin-advanced-sidebar
# or
pnpm add payload-plugin-advanced-sidebar
```

## Usage

Add the plugin to your Payload configuration:

```typescript
import { buildConfig } from 'payload/config';
import { advancedSidebarPlugin } from 'payload-plugin-advanced-sidebar';
import { Settings, Users } from 'lucide-react';

export default buildConfig({
  // ... rest of your config
  plugins: [
    advancedSidebarPlugin({
      navItems: [
        {
          type: 'group',
          label: 'Content Management',
          icon: Settings, // Optional group icon
          items: [
            {
              type: 'collection',
              slug: 'posts',
              icon: Settings, // Optional item icon
            },
            {
              type: 'collection',
              slug: 'pages',
              icon: Settings,
            }
          ]
        },
        {
          type: 'group',
          label: 'Administration',
          items: [
            {
              type: 'collection',
              slug: 'users',
              icon: Users,
            }
          ]
        }
      ],
      // Optional: Globally hide specific collections/globals
      hideSettings: {
        collections: ['hidden-collection'],
        globals: ['hidden-global']
      }
    }),
  ],
});
```

![Configuration Example](https://via.placeholder.com/800x400.png?text=Add+Configuration+Screenshot+Here)

## Plugin Options

| Option | Type | Description |
|--------|------|-------------|
| `navItems` | `NavItem[]` | Array of custom navigation groups and items to render in the sidebar. |
| `hideSettings` | `{ collections?: string[], globals?: string[] }` | Optional settings to hide specific collections or globals from the sidebar. |
| `disabled` | `boolean` | Set to `true` to disable the plugin entirely. |

## Development

To develop or contribute to this plugin:

1. Clone the repository
2. Run `pnpm install`
3. Run `pnpm dev` to start the development server
4. Edit the files in the `src` directory

## License

MIT
