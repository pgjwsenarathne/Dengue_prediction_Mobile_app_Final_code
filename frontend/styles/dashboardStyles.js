import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const dashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    greeting: {
        fontSize: 16,
        fontWeight: '500',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    riskCard: {
        height: 200,
        marginBottom: 32,
        borderRadius: 24,
        overflow: 'hidden',
    },
    riskContentWrapper: {
        paddingHorizontal: 20,
        paddingTop: 20,
        flex: 1,
    },
    gradientBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    riskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    riskInfo: {},
    riskLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    riskValue: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '800',
    },
    riskIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    riskDesc: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        lineHeight: 20,
    },
    riskBottomBar: {
        height: 50,
        backgroundColor: 'rgba(0,0,0,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
    },
    updatedText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '500',
    },
    refreshContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 32,
    },
    actionItem: {
        width: (width - 64) / 2,
        alignItems: 'center',
        gap: 12,
    },
    actionIcon: {
        width: '100%',
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    quickActionsContainer: {
        position: 'relative',
    },
    backgroundLion: {
        position: 'absolute',
        right: 40,
        top: 300,
        width: 300,
        height: 300,
        opacity: 0.15,
        zIndex: 0,
    },
    statsCard: {
        marginBottom: 32,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    statDivider: {
        width: 1,
        height: 40,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#95A5A6',
        marginBottom: 4,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    tipCard: {
        padding: 16,
    },
    tipContent: {
        flexDirection: 'row',
        gap: 16,
    },
    tipTextContainer: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    tipDesc: {
        fontSize: 14,
        lineHeight: 20,
    },
});
