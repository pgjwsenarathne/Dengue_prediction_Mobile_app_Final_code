import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * Add your SF Symbols to Material Icons mappings here.
 */
const MAPPING = {
    // Tabs
    'house.fill': { set: 'MaterialIcons', name: 'home' },
    'paperplane.fill': { set: 'MaterialIcons', name: 'send' },
    // Auth & General
    'chevron.left': { set: 'MaterialIcons', name: 'keyboard-arrow-left' },
    'chevron.right': { set: 'MaterialIcons', name: 'keyboard-arrow-right' },
    'chevron.left.forwardslash.chevron.right': { set: 'MaterialIcons', name: 'code' },
    'person.fill': { set: 'MaterialIcons', name: 'person' },
    'shield.fill': { set: 'MaterialIcons', name: 'security' },
    'rectangle.portrait.and.arrow.right': { set: 'MaterialIcons', name: 'logout' },
    'g.circle.fill': { set: 'FontAwesome', name: 'google' },
    'f.circle.fill': { set: 'FontAwesome', name: 'facebook' },
    // Dashboard
    'exclamationmark.shield.fill': { set: 'MaterialIcons', name: 'security' },
    'doc.text.fill': { set: 'MaterialIcons', name: 'description' },
    'chart.bar.fill': { set: 'MaterialIcons', name: 'bar-chart' },
    'hand.raised.fill': { set: 'MaterialIcons', name: 'pan-tool' },
    'bell.fill': { set: 'MaterialIcons', name: 'notifications' },
    'lightbulb.fill': { set: 'MaterialIcons', name: 'lightbulb-outline' },
    'sun.max.fill': { set: 'MaterialIcons', name: 'wb-sunny' },
    'moon.stars.fill': { set: 'MaterialIcons', name: 'nights-stay' },
    'drop.fill': { set: 'MaterialIcons', name: 'opacity' },
    'tshirt.fill': { set: 'MaterialIcons', name: 'checkroom' },
    'square.grid.3x3.fill': { set: 'MaterialIcons', name: 'grid-on' },
    'bed.double.fill': { set: 'MaterialIcons', name: 'hotel' },
    'person.3.fill': { set: 'MaterialIcons', name: 'groups' },
    'bell.slash.fill': { set: 'MaterialIcons', name: 'notifications-off' },
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
    name,
    size = 24,
    color,
    style,
}) {
    const iconConfig = MAPPING[name];
    if (!iconConfig) return null;

    if (iconConfig.set === 'FontAwesome') {
        return <FontAwesome color={color} size={size} name={iconConfig.name} style={style} />;
    }
    return <MaterialIcons color={color} size={size} name={iconConfig.name} style={style} />;
}

