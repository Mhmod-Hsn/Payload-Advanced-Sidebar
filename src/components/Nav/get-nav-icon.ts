import type { LucideProps } from "lucide-react";
import type { ExoticComponent } from "react";

import * as LucideIcons from "lucide-react";

/**
 * Resolves a Lucide icon from sidebar config.
 *
 * Group labels must match Payload `admin.group` labels exactly, such as
 * `E-Mails`, while collection and global items use their slugs.
 */
export const getNavIcon = (
    slug: string,
    config?: Record<string, { icon?: string }>
): ExoticComponent<LucideProps> | undefined => {
    const iconName = config?.[slug]?.icon;
    if (iconName) {
        const IconComponent = (LucideIcons as unknown as Record<string, ExoticComponent<LucideProps>>)[iconName];
        if (IconComponent) {
            return IconComponent;
        }
    }

    return undefined;
};
