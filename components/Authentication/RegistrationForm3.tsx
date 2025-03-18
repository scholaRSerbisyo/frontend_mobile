import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Text } from '../ui/text'
import { Input } from '../ui/input'
import API_URL from '~/constants/constants'
import * as SecureStore from 'expo-secure-store'

interface ScholarDetails {
  age: number
  gender: string
  mobilenumber: string
  yearlevel: string
  school_name: string
  baranggay_name: string
}

export function RegistrationForm3() {
  const router = useRouter()
  const { scholarId } = useLocalSearchParams()
  const [scholarDetails, setScholarDetails] = useState<ScholarDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchScholarDetails()
  }, [scholarId])

  const fetchScholarDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/user/scholar/details/${scholarId}`, {
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch scholar details')
      }

      const data = await response.json()
      setScholarDetails(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (!scholarDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No scholar details found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.title}>Scholar Details</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Age</Text>
        <Input
          value={scholarDetails.age.toString()}
          style={[styles.input, styles.disabledInput]}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Gender</Text>
        <Input
          value={scholarDetails.gender}
          style={[styles.input, styles.disabledInput]}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Mobile Number</Text>
        <Input
          value={scholarDetails.mobilenumber}
          style={[styles.input, styles.disabledInput]}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Year Level</Text>
        <Input
          value={scholarDetails.yearlevel}
          style={[styles.input, styles.disabledInput]}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>School</Text>
        <Input
          value={scholarDetails.school_name}
          style={[styles.input, styles.disabledInput]}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Barangay</Text>
        <Input
          value={scholarDetails.baranggay_name}
          style={[styles.input, styles.disabledInput]}
          editable={false}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343474',
    marginBottom: 24,
    paddingTop: '20%',
    textAlign: 'center'
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    color: '#343474',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
})

