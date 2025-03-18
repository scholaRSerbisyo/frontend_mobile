import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../ui/text'

interface RSListItemProps {
  title: string
  status: 'Complete' | 'Incomplete'
  hours: string
  onPress: () => void
}

export function RSListItem({ title, status, hours, onPress }: RSListItemProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.container}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={[
        styles.status,
        status === 'Complete' ? styles.complete : styles.incomplete
      ]}>
        {status}
      </Text>
      <Text style={styles.hours}>{hours}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  complete: {
    color: '#34C759',
  },
  incomplete: {
    color: '#FF3B30',
  },
  hours: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
    textAlign: 'right',
  },
})