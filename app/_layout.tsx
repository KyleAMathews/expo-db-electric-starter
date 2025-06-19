import React from 'react';
import { Stack } from 'expo-router';
import { DBProvider } from '@tanstack/react-db';
import { todoCollection } from '../src/db/collections';

/**
 * Root layout component that provides the TanStack DB context
 * to all routes in the application
 */
export default function RootLayout() {
  return (
    <DBProvider collections={[todoCollection]}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Todo App',
            headerShown: false,
          }}
        />
      </Stack>
    </DBProvider>
  );
}
