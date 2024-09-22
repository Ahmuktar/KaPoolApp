import { View, Text, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRideStore } from '@/store';
import { API_URL } from '@/lib/utils';
import { router } from 'expo-router';
import DriverRideLayout from '@/components/DriverRideLayout';
import CustomButton from '@/components/CustomButton';

const TrackRide = () => {
  const { ride, setRide } = useRideStore(); // Get the ride details and setter from the store
  const [rideStatus, setRideStatus] = useState(ride.ride_status);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch ride status periodically
  const checkRideStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/rides/${ride._id}`);
      setRideStatus(response.data.ride_status);
      setRide(response.data); // Update the ride state
    } catch (error) {
      console.error('Error fetching ride status:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkRideStatus, 5000); // Check status every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Handler to accept the ride
  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/rides/${ride._id}/status`, {
        ride_status: 'approved',
      });
      Alert.alert('Success', 'Ride has been accepted');
      setRideStatus('approved');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept ride. Please try again.');
      console.error('Error updating ride status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to mark as arrived at destination
  const handleArrived = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/rides/${ride._id}/status`, {
        ride_status: 'arrived',
      });
      Alert.alert('Success', 'You have arrived at the destination');
      setRideStatus('arrived');
    } catch (error) {
      Alert.alert('Error', 'Failed to update status.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to start the ride
  const handleStartRide = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/rides/${ride._id}/status`, {
        ride_status: 'in_progress',
      });
      Alert.alert('Success', 'Ride has started');
      setRideStatus('in_progress');
    } catch (error) {
      Alert.alert('Error', 'Failed to start the ride.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to complete the ride
  const handleCompleteRide = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/rides/${ride._id}/status`, {
        ride_status: 'completed',
      });
      Alert.alert('Success', 'Ride is complete');
      setRideStatus('completed');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete the ride.');
    } finally {
      setIsLoading(false);
    }
  };

  // Conditional button rendering based on ride status
  const renderActionButton = () => {
    switch (rideStatus) {
      case 'approved':
        return (
          <CustomButton
            title="Arrived at destination"
            isLoading={isLoading}
            handlePress={handleArrived}
          />
        );
      case 'arrived':
        return (
          <CustomButton
            title="Start Ride"
            isLoading={isLoading}
            handlePress={handleStartRide}
          />
        );
      case 'in_progress':
        return (
          <CustomButton
            title="Complete Ride"
            isLoading={isLoading}
            handlePress={handleCompleteRide}
          />
        );
      case 'completed':
        return (
          <CustomButton
            title="Check Payment"
            isLoading={isLoading}
            handlePress={() => Alert.alert('Payment', 'Check payment functionality here')}
          />
        );
      default:
        return (
          <CustomButton
            title="Accept Ride"
            isLoading={isLoading}
            handlePress={handleAccept}
          />
        );
    }
  };

  return (
    <DriverRideLayout snapPoints={["40%", "50%"]}>
      <View className="flex-1">
        {/* Ride Details */}
        <View className="bg-white px-5 rounded-xl shadow-md mb-4">
        
          <Text className="text-lg font-bold text-gray-900 mb-2">Ride Details</Text>
          <Text className="text-gray-700">Passenger: {ride.user_id?.name}</Text>
          <Text className="text-gray-700">From: {ride.origin_address}</Text>
          <Text className="text-gray-700">To: {ride.destination_address}</Text>
          <Text className="text-gray-700">Fare: ₦{Number(ride.fare_price).toFixed(0)}</Text>
          <Text className="text-gray-700">Status: {rideStatus}</Text>
        </View>

        {/* Render action buttons based on ride status */}
        {renderActionButton()}
      </View>
    </DriverRideLayout>
  );
};

export default TrackRide;
