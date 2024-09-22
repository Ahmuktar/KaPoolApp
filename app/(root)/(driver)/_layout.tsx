import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />   
      <Stack.Screen name="confirm-ride" options={{ headerShown: false }} />   
      <Stack.Screen name="track-ride" options={{ headerShown: false }} />   
      <Stack.Screen name="payment" options={{ headerShown: false }} />   
      <Stack.Screen name="ride" options={{ headerShown: false }} />   
      <Stack.Screen name="review" options={{ headerShown: false }} />   
    </Stack>
  );
};

export default Layout;
