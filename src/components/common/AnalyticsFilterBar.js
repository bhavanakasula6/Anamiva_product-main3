import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { ANALYTICS_PERIODS } from '../../data/constants';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';

const FILTERS = [
    ANALYTICS_PERIODS.TODAY,
    ANALYTICS_PERIODS.WEEK,
    ANALYTICS_PERIODS.MONTH,
    ANALYTICS_PERIODS.YEAR,
    ANALYTICS_PERIODS.CUSTOM,
];

export default function AnalyticsFilterBar({ value, onChange }) {
    return (
        <ScrollView showsHorizontalScrollIndicator={true}>
            <View style={styles.container} >
                {FILTERS.map(item => {
                    const active = value === item;
                    return (
                        <TouchableOpacity
                            key={item}
                            onPress={() => onChange(item)}
                            style={[
                                styles.chip,
                                active && styles.activeChip,
                            ]}
                        >
                            <Text style={[styles.text, active && styles.activeText]}>
                                {item.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        margin : spacing.lg,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.gray[200],
    },
    activeChip: {
        backgroundColor: colors.primary[600],
    },
    text: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[700],
    },
    activeText: {
        color: colors.white,
        fontFamily: typography.fontFamily.semiBold,
    },
});
