import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, setupNotifications } from './lib/pushNotifications';
import NetInfo from '@react-native-community/netinfo';
import { View, StyleSheet } from 'react-native';

function AppWrapper() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    setupNotifications();
    registerForPushNotificationsAsync().then(token => {
      console.log('Push token:', token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // You can dispatch an action here to update your app's state
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle notification interaction here
    });

    // Monitor network status
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      unsubscribe();
    };
  }, []);

  const ctx = require.context('./app');
  return (
    <View style={styles.container}>
      <ExpoRoot context={ctx} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// Must be exported or Fast Refresh won't update the context
export function App() {
  return <AppWrapper />;
}

registerRootComponent(App);

