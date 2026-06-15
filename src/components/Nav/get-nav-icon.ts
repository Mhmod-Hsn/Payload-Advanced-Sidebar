import type { LucideProps } from "lucide-react";
import type { ExoticComponent } from "react";

import * as LucideIcons from "lucide-react";

const getIconConfigKeys = (slug: string) => {
    const lowerCaseSlug = slug.toLowerCase();

    return lowerCaseSlug === slug ? [slug] : [slug, lowerCaseSlug];
};

/**
 * Resolves a Lucide icon from sidebar config.
 *
 * Group labels are matched exactly first so Payload `admin.group` labels like
 * `E-Mails` work as documented, then lower-case keys are tried for backwards
 * compatibility with earlier plugin configs.
 */
export const getNavIcon = (
    slug: string,
    config?: Record<string, { icon?: string }>
): ExoticComponent<LucideProps> | undefined => {
    for (const key of getIconConfigKeys(slug)) {
        const iconName = config?.[key]?.icon;
        if (iconName) {
            const IconComponent = (LucideIcons as unknown as Record<string, ExoticComponent<LucideProps>>)[iconName];
            if (IconComponent) {
                return IconComponent;
            }
        }
    }

    return undefined;
};
