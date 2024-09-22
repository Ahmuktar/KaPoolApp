import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import axios from 'axios'
import { API_URL } from '@/lib/utils'

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    user_type: 'passenger',
    password: '',
    profile_picture_url: "https://via.placeholder.com/150/92c952"
  })
  const [errorMessage, setErrorMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const submit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await axios.post(`${API_URL}/signup`, form);
      const userData = response.data;
      
      if(userData.status === 'success') {
        // Dispatch the user data to Redux
        
        // Check user type and navigate accordingly
        if (userData.user.user_type === 'passenger') {
          router.push('/(root)/(user)/find-ride');
        } else if (userData.user.user_type === 'driver') {
          router.push('/(root)/(driver)');
        } else {
          Alert.alert('Error', 'Unknown user type.');
        }
      }else{
        setErrorMessage(userData.message);
      }
    } catch (error:any) {
      // Handle error from API or network issues
      // Alert.alert('Login Error', error.response?.data?.message || 'An error occurred during login.');
      setErrorMessage(error.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };
    

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <Image
            source={require('../../assets/images/logo.png')}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />

          <Text className="text-2xl text-gray-800 text-semibold mt-10 font-semibold">Sign up to KaPool</Text>

          <FormField 
            title="Name"
            value={form.name}
            handleChangeText={(e:any) => setForm({ ...form, name: e})}
            otherStyles="mt-10"
          />

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e:any) => setForm({ ...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e:any) => setForm({ ...form, password: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          { errorMessage && (<Text className='text-red-500 mt-3'>{errorMessage}</Text>)}

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center flex-row pt-5">
            <Text className="text-lg text-gray-500 font-pregular">Have an account already? <Link href="/sign-in" className="text-primary font-psemibold">Sign in</Link></Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp