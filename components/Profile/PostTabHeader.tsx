import React, { useState } from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { ChevronLeft, GraduationCap, MapPin, Menu, Edit2 } from 'lucide-react-native'
import { Text } from '../ui/text'
import { useRouter } from 'expo-router'
import { SideMenu } from './Sidebar/SideMenu'

interface PostTabHeaderProps {
  name: string
  school?: string
  location?: string
  photo: string
  onPhotoEdit?: () => void
}

export function PostTabHeader({ 
  name, 
  school, 
  location, 
  photo,
  onPhotoEdit 
}: PostTabHeaderProps) {
  const router = useRouter()
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false)

  return (
    <View>
      <View style={styles.topBackground} />
      <View style={styles.bottomBackground} />
      <View style={styles.content}>
        <View style={styles.topSection}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <ChevronLeft color="#FDB316" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setIsSideMenuVisible(true)}
          >
            <Menu color="#FDB316" size={30} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileImageWrapper}>
            <TouchableOpacity 
              style={styles.profileImageContainer}
              onPress={onPhotoEdit}
            >
              <Image
                source={{ uri: photo }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={onPhotoEdit}
            >
              <Edit2 color="#FFFFFF" size={12} />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{name}</Text>
          
          <View >
            <View style={styles.detailRow}>
              <GraduationCap color="#FDB316" size={16} />
              <Text style={styles.detailText}>
                Studied at <Text style={styles.detailBold}>{school}</Text>
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MapPin color="#FDB316" size={16} />
              <Text style={styles.detailText}>
                Live in <Text style={styles.detailBold}>{location}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
      <SideMenu 
        isVisible={isSideMenuVisible}
        onClose={() => setIsSideMenuVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#343474',
  },
  bottomBackground: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'white',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  topSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
    paddingTop: 16
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImageWrapper: {
    position: 'relative',
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  profileImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    borderWidth: 4,
    borderColor: 'white',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 24,
    height: 24,
    backgroundColor: '#000000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 2,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    paddingTop: 12
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: '15%'
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
  },
  detailBold: {
    color: '#333333',
    fontWeight: '500',
  },
})