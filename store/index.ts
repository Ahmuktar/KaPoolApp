import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { DriverStore, LocationStore, MarkerData } from "@/types/type";

export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },

  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },
  clearLocation: () => set(() => ({
    userLatitude: null,
    userLongitude: null,
    userAddress: null,
    destinationLatitude: null,
    destinationLongitude: null,
    destinationAddress: null,
  }))
}));

export const useDriverStore = create((set) => ({
  drivers: null, // This will hold the list of drivers with time info
  selectedDriver: null, // This stores the currently selected driver

  // Function to set the selected driver
  setSelectedDriver: (driverId: any) =>
    set(() => ({ selectedDriver: driverId })),

  // Function to set the drivers including their calculated times
  setDrivers: (driversWithTimes: any[]) =>
    set(() => ({
      drivers: driversWithTimes.map((driver) => ({
        ...driver, // Spread existing driver data
        time: driver.time, // Set time (which has been calculated)
        ride_time: driver.ride_time, // Setride time (which has been calculated)
      })),
    })),

  // Function to clear the selected driver
  clearSelectedDriver: () =>
    set(() => ({
      selectedDriver: null,
    })),
}));


export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: true,  // Add this line
      setUser: (user) => set({ user }),
      logOut: () => set({ user: null }),
      setIsLoading: (isLoading) => set({ isLoading }),  // Add this line
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state.setIsLoading(false);  // Add this line
      },
    }
  )
);


export const useRideStore = create((set) => ({
  ride: null,
  status: null,
  setRide: (ride) => set(() => ({ ride })),
  setRideStatus: (status) => set(() => ({ status })),
}));

export const usePassengerStore = create((set) => ({
  passengerRide: null,
  setPassengerRide: (ride) => set({ passengerRide: ride }),
}));