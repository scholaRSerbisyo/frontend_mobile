import React from 'react'
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../ui/text'
import { X } from 'lucide-react-native'
import type { MonthlyData } from './types/return-service'

interface RSDetailOverlayProps {
  visible: boolean
  onClose: () => void
  year: string
  semester: 'firstSem' | 'secondSem'
  monthlyData: MonthlyData[]
  totalRequired: number
}

// Define types for month mappings
type FirstSemesterMonth = 'December' | 'November' | 'October' | 'September' | 'August' | 'July'
type SecondSemesterMonth = 'June' | 'May' | 'April' | 'March' | 'February' | 'January'

type MonthMappings = {
  firstSem: Record<FirstSemesterMonth, number>
  secondSem: Record<SecondSemesterMonth, number>
}

// Months in descending order for each semester
const firstSemesterMonths = ['December', 'November', 'October', 'September', 'August', 'July'] as const
const secondSemesterMonths = ['June', 'May', 'April', 'March', 'February', 'January'] as const

// Month number mapping for data processing
const monthNumberMap: MonthMappings = {
  firstSem: {
    December: 12,
    November: 11,
    October: 10,
    September: 9,
    August: 8,
    July: 7
  },
  secondSem: {
    June: 6,
    May: 5,
    April: 4,
    March: 3,
    February: 2,
    January: 1
  }
}

export function RSDetailOverlay({ 
  visible, 
  onClose,
  year,
  semester,
  monthlyData,
  totalRequired = 5
}: RSDetailOverlayProps) {
  // Select appropriate months based on semester
  const months = semester === 'firstSem' ? firstSemesterMonths : secondSemesterMonths
  
  // Create a map of month names to their counts
  const monthsData = new Map(
    monthlyData.map(data => {
      const monthNumber = data.month
      const monthName = months.find(month => {
        const monthMap = monthNumberMap[semester]
        return monthMap[month as keyof typeof monthMap] === monthNumber
      })
      return [monthName, data.count]
    })
  )

  const totalCount = monthlyData.reduce((sum, data) => sum + data.count, 0)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Year: {year} - {semester === 'firstSem' ? '1st' : '2nd'} Semester
            </Text>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.columnHeader}>Month</Text>
            <Text style={[styles.columnHeader, styles.rightAlign]}>Number of Approved RS</Text>
          </View>

          {months.map((month) => (
            <View key={month} style={styles.row}>
              <Text style={styles.monthText}>{month}</Text>
              <Text style={[styles.countText, styles.rightAlign]}>
                {monthsData.get(month) || 0}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total RS: {totalCount}/{totalRequired}</Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  columnHeader: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  monthText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  countText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  rightAlign: {
    textAlign: 'right',
  },
  totalRow: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
})