import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, ActivityIndicator, View } from 'react-native'
import { RSListItem } from './RSListItem'
import { RSDetailOverlay } from './RSDetailOverlay'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import API_URL from '~/constants/constants'
import { Text } from '../ui/text'
import type { ReturnService, SemesterData, YearlyReturnService, ScholarResponse } from './types/return-service'

export function RSYearView() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [returnService, setReturnService] = useState<ReturnService | null>(null)
  const [selectedSemester, setSelectedSemester] = useState<{
    year: number
    semester: 'firstSem' | 'secondSem'
    data: SemesterData
  } | null>(null)

  useEffect(() => {
    fetchReturnServiceCount()
  }, [])

  const fetchReturnServiceCount = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const scholarId = await SecureStore.getItemAsync('scholarId')
      
      if (!token || !scholarId) {
        throw new Error('Authentication credentials not found')
      }

      const response = await axios.get<ScholarResponse>(
        `${API_URL}/events/scholars/${scholarId}/return-service-count`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      setReturnService(response.data.scholar)
    } catch (err) {
      console.error('Error fetching return service count:', err)
      setError('Failed to load return service data')
    } finally {
      setLoading(false)
    }
  }

  const handleSemesterPress = (year: number, semester: 'firstSem' | 'secondSem', data: SemesterData) => {
    setSelectedSemester({
      year,
      semester,
      data
    })
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FDB316" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (!returnService?.yearlyReturnServices || returnService.yearlyReturnServices.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>No Return Service found</Text>
      </View>
    )
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, styles.yearHeader]}>Year</Text>
            <Text style={[styles.headerText, styles.statusHeader]}>Status</Text>
            <Text style={[styles.headerText, styles.rsHeader]}>Recorded RS</Text>
          </View>
        </View>
        {returnService.yearlyReturnServices
          .sort((a: YearlyReturnService, b: YearlyReturnService) => b.year - a.year)
          .map((yearData: YearlyReturnService) => (
            <View key={yearData.year}>
              <Text style={styles.yearText}>{yearData.year}</Text>
              <RSListItem
                title="1st Sem"
                status={yearData.firstSem.count >= 5 ? 'Complete' : 'Incomplete'}
                hours={`${yearData.firstSem.count}/5`}
                onPress={() => handleSemesterPress(yearData.year, 'firstSem', yearData.firstSem)}
              />
              <RSListItem
                title="2nd Sem"
                status={yearData.secondSem.count >= 5 ? 'Complete' : 'Incomplete'}
                hours={`${yearData.secondSem.count}/5`}
                onPress={() => handleSemesterPress(yearData.year, 'secondSem', yearData.secondSem)}
              />
            </View>
          ))}
      </ScrollView>

      {selectedSemester && (
        <RSDetailOverlay
          visible={!!selectedSemester}
          onClose={() => setSelectedSemester(null)}
          year={selectedSemester.year.toString()}
          semester={selectedSemester.semester}
          monthlyData={selectedSemester.data.months}
          totalRequired={5}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    minHeight: 200,
  },
  headerContainer: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  headerText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  yearHeader: {
    flex: 1,
  },
  statusHeader: {
    flex: 1,
    textAlign: 'center',
  },
  rsHeader: {
    flex: 1,
    textAlign: 'right',
  },
  yearText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 8,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  noDataText: {
    color: '#343474',
    fontSize: 18,
    textAlign: 'center',
  },
})