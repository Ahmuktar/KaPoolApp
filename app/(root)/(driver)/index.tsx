import { View, Text, FlatList, ActivityIndicator, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import PassengerCard from '@/components/PassengerCard';
import { usePassengerStore, useUserStore } from '@/store';
import axios from 'axios';
import { API_URL } from '@/lib/utils';
import DriverRideLayout from '@/components/DriverRideLayout';
import { images } from '@/constants';
import * as Location from 'expo-location';


const Home = () => {
    const { passengerRide, setPassengerRide } = usePassengerStore();
    const { user } = useUserStore();
    const [loading, setLoading] = useState(false);

    const fetchRides = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/drivers/${user._id}/rides`);
            setPassengerRide(response.data);  // Set the fetched ride data to the store
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    const [hasPermission, setHasPermission] = useState<boolean>(false);

  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setHasPermission(false);
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});

//       const address = await Location.reverseGeocodeAsync({
//         latitude: location.coords?.latitude!,
//         longitude: location.coords?.longitude!,
//       });

//       setUserLocation({
//         latitude: location.coords?.latitude,
//         longitude: location.coords?.longitude,
//         address: `${address[0].name}, ${address[0].region}`,
//       });
//     })();
//   }, []);

    return (
        <DriverRideLayout showSidebar showBackArrow={false} snapPoints={["65%", "85%"]}>
            <View>
                <FlatList
                    data={passengerRide}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <PassengerCard ride={item} />
                    )}
                    ListEmptyComponent={() =>
                        loading ? (
                            <View className="flex flex-col items-center justify-center">
                                <ActivityIndicator size="large" color="green" />
                                <Text className="mt-2">Loading rides...</Text>
                            </View>
                        ) : (
                            <View className="flex flex-col items-center justify-center">
                                <Image
                                    source={images.noResult}
                                    className="w-40 h-40"
                                    alt="No recent rides found"
                                    resizeMode="contain"
                                />
                                <Text className="text-sm">No rides found</Text>
                            </View>
                        )
                    }
                />
            </View>
        </DriverRideLayout>
    );
};

export default Home;
