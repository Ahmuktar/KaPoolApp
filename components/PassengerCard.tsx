import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRideStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const PassengerCard = ({ ride }) => {
  const { setRide } = useRideStore(); // Access the ride store

  const handleCardPress = () => {
    setRide(ride); // Set the ride in the store
    if(ride.ride_status !== 'approved' || ride.ride_status !== 'requested'){
      router.push('/(root)/(driver)/track-ride'); // Navigate to the track-ride page
    }else{
      router.push('/(root)/(driver)/confirm-ride'); // Navigate to the track-ride page
    }
    
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      className="bg-white p-6 rounded-xl shadow-lg mb-4 border border-gray-200"
      style={{
        elevation: 4, // Adds shadow for Android
        backgroundColor: '#f9fafb', // Light background color for a modern feel
      }}
    >
      {/* Ride Details */}
      <View className="mb-4">
        <Text className="font-semibold text-lg text-black mb-1">
          {ride.user_id?.name || 'Passenger'}
        </Text>
        <View className="flex-row justify-between">
          <Text className="text-gray-600 text-sm">From:</Text>
          <Text className="text-gray-800 text-sm font-medium ml-2">
            {ride.origin_address}
          </Text>
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-gray-600 text-sm">To:</Text>
          <Text className="text-gray-800 text-sm font-medium ml-2">
            {ride.destination_address}
          </Text>
        </View>
      </View>

      {/* Fare and Status */}
      <View className="flex-row justify-between items-center mt-3">
        <View>
          <Text className="text-sm text-gray-600">Fare</Text>
          <Text className="text-lg text-green-600 font-bold">
            ${ride.fare_price.toFixed(2)}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-gray-600">Status</Text>
          <Text
            className={`text-lg font-bold ${
              ride.ride_status === 'completed' ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {ride.ride_status.charAt(0).toUpperCase() + ride.ride_status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PassengerCard;
