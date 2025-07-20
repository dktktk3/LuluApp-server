export default {
  expo: {
    name: 'Ai.Lullu',
    slug: 'ai-lulluapp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/logo.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/logo.png',
        backgroundColor: '#000000'
      },
      package: 'com.lullu.botapp'
    },
    web: {
      favicon: './assets/logo.png'
    },
    extra: {
      eas: {
        projectId: '7d8b471b-6532-46c5-8280-3ffbe980f0af'
      }
    },
    cli: {
      appVersionSource: 'remote'
    }
  }
};
