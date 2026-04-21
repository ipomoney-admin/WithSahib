import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.withsahib.app',
  appName: 'withSahib',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // For development, point to your local/deployed URL:
    // url: 'http://192.168.1.x:3000',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#06090F',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#06090F',
    },
    App: {
      // Handle deep links
    },
    Keyboard: {
      resize: 'body',
      style: 'Dark',
      resizeOnFullScreen: true,
    },
    Haptics: {
      // Enabled by default
    },
  },
  android: {
    buildOptions: {
      releaseType: 'AAB',
    },
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  },
}

export default config
