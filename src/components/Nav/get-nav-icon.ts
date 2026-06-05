import type { LucideProps } from "lucide-react";
import type { ExoticComponent } from "react";

import * as LucideIcons from "lucide-react";

export const getNavIcon = (
    slug: string,
    config?: Record<string, { icon?: string }>
): ExoticComponent<LucideProps> | undefined => {
    if (config?.[slug]) {
        const iconName = config[slug].icon;
        if (iconName) {
            const IconComponent = (LucideIcons as unknown as Record<string, ExoticComponent<LucideProps>>)[iconName];
            if (IconComponent) {
                return IconComponent;
            }
        }
    }

    return undefined;
};
