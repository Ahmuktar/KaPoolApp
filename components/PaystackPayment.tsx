import React from 'react';
import { View, Text, Alert } from 'react-native';
import PaystackWebView from 'react-native-paystack-webview';
import { API_URL } from '@/lib/utils';
import axios from 'axios';

const PaystackPayment = ({ amount, email, reference, onSuccess }) => {
  // Handle Paystack response after successful payment
  const handlePaystackSuccess = async (responseData) => {
    try {
      // Make an API call to verify the payment if necessary
      const verifyResponse = await axios.get(`${API_URL}/verify-payment/${reference}`);
      
      if (verifyResponse.data.status === 'success') {
        Alert.alert('Payment Successful', 'Your payment was successful');
        // Invoke the success callback
        onSuccess(responseData);
      } else {
        Alert.alert('Payment Failed', 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      Alert.alert('Error', 'Error verifying payment');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PaystackWebView
        showPayButton={false}
        paystackKey="your-public-paystack-key" // Replace with your Paystack public key
        amount={amount}
        billingEmail={email}
        activityIndicatorColor="green"
        onCancel={(e) => {
          Alert.alert('Payment Cancelled', 'You cancelled the payment');
        }}
        onSuccess={handlePaystackSuccess}
        autoStart={true}
        reference={reference}
      />
    </View>
  );
};

export default PaystackPayment;
