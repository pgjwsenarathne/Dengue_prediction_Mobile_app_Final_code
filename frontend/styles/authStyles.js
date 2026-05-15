import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 0, // Footer should be at the bottom
    },
    // Top Section
    headerBackground: {
        width: '100%',
        height: height * 0.42,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        paddingTop: 60,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        zIndex: 1,
        overflow: 'hidden', // Required to keep background image within curved borders
    },
    headerBackgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '110%', // Increased height to allow shifting down
        top: 20, // Shifting the image lower
        opacity: 0.8,
    },
    langSelector: {
        position: 'absolute',
        top: 50,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    topActionsContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    loginThemeToggle: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    langSelectorNative: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    slMiniFlag: {
        width: 24,
        height: 16,
        marginRight: 6,
    },
    langText: {
        fontSize: 14,
        fontWeight: '700',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    shieldLogo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    brandName: {
        fontSize: 32,
        fontWeight: '900',
        color: '#004D40',
        letterSpacing: -1,
    },
    brandNameRed: {
        color: '#E53E3E',
    },
    brandSlogan: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A202C',
        marginTop: 4,
    },
    brandMission: {
        fontSize: 13,
        color: '#718096',
        marginTop: 2,
        fontWeight: '600',
    },
    mosquitoIllustration: {
        width: 120,
        height: 80,
        position: 'absolute',
        bottom: 40,
        left: 30,
        opacity: 0.8,
    },
    citySilhouette: {
        width: '100%',
        height: 120,
        position: 'absolute',
        bottom: 0,
        opacity: 0.1,
    },

    // Form Section
    formContainer: {
        paddingHorizontal: 32,
        paddingTop: 30,
        paddingBottom: 40,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1A202C',
    },
    loginSubtitle: {
        fontSize: 15,
        color: '#718096',
        marginBottom: 24,
        fontWeight: '500',
    },
    rememberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: -10,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#004D40',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#4A5568',
        fontWeight: '600',
    },
    forgotText: {
        fontSize: 14,
        color: '#004D40',
        fontWeight: '700',
    },
    loginButton: {
        backgroundColor: '#002D2D',
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        marginLeft: 10,
    },
    noAccountText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: '#718096',
        fontWeight: '600',
    },
    signUpLink: {
        color: '#004D40',
        fontWeight: '800',
    },
    footerLinks: {
        marginTop: 10,
    },

    // Footer Section
    footer: {
        backgroundColor: '#002D2D',
        width: '100%',
        paddingVertical: 30,
        alignItems: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginTop: 20,
    },
    slEmblem: {
        width: 45,
        height: 45,
        marginBottom: 12,
    },
    footerTextMain: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        opacity: 0.9,
    },
    footerTextSub: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '500',
        opacity: 0.6,
        marginTop: 4,
    },

    // Utility
    inputIcon: {
        marginRight: 10,
    }
});
