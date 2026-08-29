import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const AccountSettingsTab: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(true);
  const [currentLang, setCurrentLang] = useState('English');
  const [currentCurrency, setCurrentCurrency] = useState('EGP');

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* 1. User Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>AH</Text>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>Ahmed Hassan</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>EG 🇪🇬</Text>
            </View>
          </View>
          <Text style={styles.userEmail}>ahmed.hassan@autoversus.com</Text>
          <Text style={styles.userRole}>AutoVersus VIP Member</Text>
        </View>
      </View>

      {/* 2. Account Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>ACCOUNT & PERSONAL INFO</Text>

        <View style={styles.cardGroup}>
          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="person-outline" size={20} color="#0F2942" style={styles.icon} />
              <View>
                <Text style={styles.rowTitle}>Personal Profile</Text>
                <Text style={styles.rowSubtitle}>Ahmed Hassan · Cairo, Egypt</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="mail-outline" size={20} color="#0F2942" style={styles.icon} />
              <View>
                <Text style={styles.rowTitle}>Email Address</Text>
                <Text style={styles.rowSubtitle}>ahmed.hassan@autoversus.com</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="location-outline" size={20} color="#0F2942" style={styles.icon} />
              <View>
                <Text style={styles.rowTitle}>Regional Market</Text>
                <Text style={styles.rowSubtitle}>Egypt (EGP - Egyptian Pound)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Regional Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>REGIONAL PREFERENCES</Text>

        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => setCurrentCurrency(currentCurrency === 'EGP' ? 'USD' : 'EGP')}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="cash-outline" size={20} color="#0F2942" style={styles.icon} />
              <Text style={styles.rowTitle}>Currency</Text>
            </View>
            <Text style={styles.rowValue}>{currentCurrency}</Text>
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => setCurrentLang(currentLang === 'English' ? 'العربية' : 'English')}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="language-outline" size={20} color="#0F2942" style={styles.icon} />
              <Text style={styles.rowTitle}>Language</Text>
            </View>
            <Text style={styles.rowValue}>{currentLang}</Text>
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <Ionicons name="speedometer-outline" size={20} color="#0F2942" style={styles.icon} />
              <Text style={styles.rowTitle}>Measurement System</Text>
            </View>
            <Text style={styles.rowValue}>Metric (km, L/100km)</Text>
          </View>
        </View>
      </View>

      {/* 4. Notification & Security Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>NOTIFICATIONS & SECURITY</Text>

        <View style={styles.cardGroup}>
          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color="#0F2942" style={styles.icon} />
              <Text style={styles.rowTitle}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#0F2942' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <Ionicons name="pricetag-outline" size={20} color="#0F2942" style={styles.icon} />
              <Text style={styles.rowTitle}>Price Drop Alerts</Text>
            </View>
            <Switch
              value={priceAlertsEnabled}
              onValueChange={setPriceAlertsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#0F2942' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0F2942" style={styles.icon} />
              <Text style={styles.rowTitle}>Security & Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color="#C92A2A" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2942',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 13,
    color: '#93C5FD',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 10,
    paddingLeft: 4,
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 14,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F2942',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 50,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C92A2A',
  },
});
