import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { useRouter } from 'expo-router'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import API_URL from '~/constants/constants'
import { BottomNavigation, ScreenName } from '~/components/Navigation/BottomNavigation'

interface InfoFieldProps {
  label: string
  value: string | undefined
  isLast?: boolean
}

interface School {
  school_id: number;
  school_name: string;
  // Add other properties if needed
}

interface SchoolResponse {
  school: School;
  events: any[]; // You can create a more specific type for events if needed
  upcoming_events: any[];
  past_events: any[];
}

interface Location {
  baranggay: {
    baranggay_id: number;
    baranggay_name: string;
  }
}

interface ScholarData {
  user_id: number;
  email: string;
  email_verified_at: string | null;
  role_id: number;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  scholar: {
    scholar_id: number;
    firstname: string;
    lastname: string;
    birthdate: string;
    gender: string;
    age: string;
    address: string;
    mobilenumber: string;
    course: string;
    yearlevel: string;
    scholar_type_id: number;
    user_id: number;
    school_id: number;
    baranggay_id: number;
    created_at: string;
    updated_at: string;
  };
}

const InfoField = ({ label, value, isLast }: InfoFieldProps) => (
  <View style={[styles.fieldContainer, isLast && styles.lastFieldContainer]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value}</Text>
    <View style={styles.fieldBorder} />
  </View>
)

const ScholarsInfoScreen = () => {
  const router = useRouter()
  const [scholarData, setScholarData] = useState<ScholarData | null>(null)
  const [school, setSchool] = useState<School | null>(null)
  const [barangay, setBarangay] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchScholarData()
  }, [])

  useEffect(() => {
    if (scholarData) {
      fetchSchools()
      fetchLocations()
    }
  }, [scholarData])

  const fetchScholarData = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get<ScholarData>(`${API_URL}/user/scholar/me/show`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setScholarData(response.data)
    } catch (err) {
      console.error('Error fetching scholar data:', err)
      setError('Failed to load scholar data')
    }
  }

  const fetchSchools = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get<SchoolResponse>(`${API_URL}/school/schools/${scholarData?.scholar.school_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setSchool(response.data.school)
    } catch (err) {
      console.error('Error fetching school data:', err)
      setError('Failed to load school data')
    }
  }

  const fetchLocations = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get<Location>(`${API_URL}/baranggay/baranggays/${scholarData?.scholar.baranggay_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setBarangay(response.data)
    } catch (err) {
      console.error('Error fetching barangay data:', err)
      setError('Failed to load barangay data')
    }
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scholar's Info</Text>
        </View>

        <ScrollView style={styles.content}>
          <InfoField 
            label="First Name" 
            value={scholarData?.scholar.firstname}
          />
          <InfoField 
            label="Last Name" 
            value={scholarData?.scholar.lastname}
          />
          <InfoField 
            label="Birthdate" 
            value={scholarData?.scholar.birthdate}
          />
          <InfoField 
            label="Age" 
            value={scholarData?.scholar.age}
          />
          <InfoField 
            label="Mobile Number" 
            value={scholarData?.scholar.mobilenumber}
          />
          <InfoField 
            label="Gender" 
            value={scholarData?.scholar.gender}
          />
          <InfoField 
            label="Course" 
            value={scholarData?.scholar.course}
          />
          <InfoField 
            label="Year Level" 
            value={scholarData?.scholar.yearlevel}
          />
          <InfoField 
            label="School" 
            value={school?.school_name}
          />
          <InfoField 
            label="Barangay" 
            value={barangay?.baranggay.baranggay_name}
            isLast
          />
        </ScrollView>
        <BottomNavigation activeScreen={ScreenName.Profile} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343474',
  },
  header: {
    backgroundColor: '#343474',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: '10%',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  backText: {
    fontSize: 18,
    color: '#FDB316',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  lastFieldContainer: {
    marginBottom: 80,
  },
  fieldLabel: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,

  },
  fieldValue: {
    fontSize: 16,
    color: '#8F8B8B',
    marginBottom: 8,
  },
  fieldBorder: {
    height: 1,
    backgroundColor: '#000000',
    opacity: 0.1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default ScholarsInfoScreen


// import React, { useState, useEffect } from 'react'
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
// import { useRouter } from 'expo-router'
// import { BottomNavigation } from '~/components/Navigation/BottomNavigation'

// interface ScholarInfo {
//   firstName: string
//   lastName: string
//   birthdate: string
//   age: string
//   mobileNumber: string
//   gender: string
//   course: string
//   yearLevel: string
//   school: string
//   barangay: string
// }

// interface InfoFieldProps {
//   label: string
//   value: string
//   isLast?: boolean
// }

// const InfoField = ({ label, value, isLast }: InfoFieldProps) => (
//   <View style={[styles.fieldContainer, isLast && styles.lastFieldContainer]}>
//     <Text style={styles.fieldLabel}>{label}</Text>
//     <Text style={styles.fieldValue}>{value}</Text>
//     <View style={styles.fieldBorder} />
//   </View>
// )

// const ScholarsInfoScreen = () => {
//   const router = useRouter()
//   const [scholarInfo, setScholarInfo] = useState<ScholarInfo | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     fetchScholarInfo()
//   }, [])

//   const fetchScholarInfo = async () => {
//     try {
//       setIsLoading(true)
//       // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your backend
//       const response = await fetch('YOUR_API_ENDPOINT')
//       if (!response.ok) {
//         throw new Error('Failed to fetch scholar info')
//       }
//       const data: ScholarInfo = await response.json()
//       setScholarInfo(data)
//       setIsLoading(false)
//     } catch (err) {
//       setError('Error fetching scholar info. Please try again later.')
//       setIsLoading(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#FDB316" />
//         </View>
//       </SafeAreaView>
//     )
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       </SafeAreaView>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={{ flex: 1 }}>
//         <View style={styles.header}>
//           <TouchableOpacity 
//             onPress={() => router.back()}
//             style={styles.backButton}
//           >
//             <Text style={styles.backText}>Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Scholar's Info</Text>
//         </View>

//         <ScrollView style={styles.content}>
//           {scholarInfo && (
//             <>
//               <InfoField label="First Name" value={scholarInfo.firstName} />
//               <InfoField label="Last Name" value={scholarInfo.lastName} />
//               <InfoField label="Birthdate" value={scholarInfo.birthdate} />
//               <InfoField label="Age" value={scholarInfo.age} />
//               <InfoField label="Mobile Number" value={scholarInfo.mobileNumber} />
//               <InfoField label="Gender" value={scholarInfo.gender} />
//               <InfoField label="Course" value={scholarInfo.course} />
//               <InfoField label="Year Level" value={scholarInfo.yearLevel} />
//               <InfoField label="School" value={scholarInfo.school} />
//               <InfoField label="Barangay" value={scholarInfo.barangay} isLast />
//             </>
//           )}
//         </ScrollView>
//         <BottomNavigation />
//       </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#343474',
//   },
//   header: {
//     backgroundColor: '#343474',
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     marginTop: '10%',
//   },
//   backButton: {
//     position: 'absolute',
//     left: 20,
//     zIndex: 1,
//   },
//   backText: {
//     fontSize: 18,
//     color: '#FDB316',
//     fontWeight: '600',
//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },
//   content: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 100,
//   },
//   fieldContainer: {
//     marginBottom: 20,
//   },
//   fieldLabel: {
//     fontSize: 16,
//     color: '#FDB316',
//     marginBottom: 8,
//   },
//   fieldValue: {
//     fontSize: 16,
//     color: '#000000',
//     marginBottom: 8,
//   },
//   fieldBorder: {
//     height: 1,
//     backgroundColor: '#000000',
//     opacity: 0.1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },
//   lastFieldContainer: {
//     marginBottom: 80,
//   },
// })

// export default ScholarsInfoScreen