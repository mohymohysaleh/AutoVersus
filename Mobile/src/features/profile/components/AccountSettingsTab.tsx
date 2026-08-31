import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../identity/store/auth.store';

type ActiveModal = 'profile' | 'email' | 'market' | 'currency' | 'language' | 'measurement' | 'security' | 'logout' | null;

export const AccountSettingsTab: React.FC = () => {
  const { user, logout } = useAuthStore();
  const isGoogleAccount = user?.authProvider === 'GOOGLE' || user?.email?.includes('google');

  // Extract name parts
  const initialFirstName = user?.name ? user.name.split(' ')[0] : 'Ahmed';
  const initialLastName = user?.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : 'Hassan';

  // Personal Profile State
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [userEmail, setUserEmail] = useState(user?.email || 'ahmed.hassan@autoversus.com');
  const [userPhone, setUserPhone] = useState('+20 100 123 4567');
  const [userCity, setUserCity] = useState('Cairo');
  const [buyerPersona, setBuyerPersona] = useState<string>('Looking to Buy 🛒');

  // Secondary Email State
  const [emailVerified] = useState(true);
  const [digestSubscription, setDigestSubscription] = useState(true);

  // Regional Preferences State
  const [currentCountry, setCurrentCountry] = useState('Egypt 🇪🇬');
  const [currentCurrency, setCurrentCurrency] = useState('EGP (Egyptian Pound £)');
  const [currentLang, setCurrentLang] = useState('English');
  const [measurementSystem, setMeasurementSystem] = useState('Metric (km, kW, Nm)');

  // Toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(true);

  // Active Modal Sheet
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Modal Temp Draft Inputs
  const [editFirstName, setEditFirstName] = useState(firstName);
  const [editLastName, setEditLastName] = useState(lastName);
  const [editPhone, setEditPhone] = useState(userPhone);
  const [editCity, setEditCity] = useState(userCity);
  const [editPersona, setEditPersona] = useState(buyerPersona);

  // Email Inputs
  const [newEmailInput, setNewEmailInput] = useState('');
  const [confirmEmailInput, setConfirmEmailInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Security Inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fullName = `${firstName} ${lastName}`;

  const openProfileModal = () => {
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setEditPhone(userPhone);
    setEditCity(userCity);
    setEditPersona(buyerPersona);
    setActiveModal('profile');
  };

  const saveProfile = () => {
    if (!isGoogleAccount) {
      setFirstName(editFirstName);
      setLastName(editLastName);
    }
    setUserPhone(editPhone);
    setUserCity(editCity);
    setBuyerPersona(editPersona);
    setActiveModal(null);
    Alert.alert('Profile Updated', 'Your personal information has been successfully saved.');
  };

  const handleSendEmailVerification = () => {
    if (isGoogleAccount) {
      Alert.alert('Google Account', 'Primary email address is managed by Google and cannot be modified.');
      return;
    }
    if (!newEmailInput || newEmailInput !== confirmEmailInput) {
      Alert.alert('Invalid Email', 'Please make sure both email addresses match.');
      return;
    }
    setOtpSent(true);
    Alert.alert('Verification Code Sent', `We sent a 6-digit OTP code to ${newEmailInput}.`);
  };

  const confirmNewEmail = () => {
    setUserEmail(newEmailInput);
    setOtpSent(false);
    setNewEmailInput('');
    setConfirmEmailInput('');
    setActiveModal(null);
    Alert.alert('Email Updated', 'Your primary account email address has been updated.');
  };

  const savePassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setActiveModal(null);
    Alert.alert('Security Updated', 'Your password has been successfully updated.');
  };

  const handleLogout = () => {
    setActiveModal(null);
    logout();
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* 1. User Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {firstName[0]}
            {lastName[0]}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{fullName}</Text>
            {isGoogleAccount ? (
              <View style={styles.googleBadgePill}>
                <Ionicons name="logo-google" size={12} color="#EA4335" />
                <Text style={styles.googleBadgeText}>Google</Text>
              </View>
            ) : (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>VIP 🇪🇬</Text>
              </View>
            )}
          </View>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <Text style={styles.userRole}>{buyerPersona} · {userCity}</Text>
        </View>

        <TouchableOpacity style={styles.editProfileCircle} onPress={openProfileModal}>
          <Ionicons name="pencil" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 2. Account Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>ACCOUNT & PERSONAL INFO</Text>

        <View style={styles.cardGroup}>
          {/* Personal Profile Row */}
          <TouchableOpacity style={styles.rowItem} onPress={openProfileModal} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="person-outline" size={20} color="#0F2942" style={styles.icon} />
              <View>
                <View style={styles.inlineHeaderRow}>
                  <Text style={styles.rowTitle}>Personal Profile</Text>
                  {isGoogleAccount && (
                    <View style={styles.googleInlineBadge}>
                      <Ionicons name="logo-google" size={10} color="#EA4335" />
                      <Text style={styles.googleInlineText}>Google Account</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.rowSubtitle}>
                  {fullName} · {userPhone}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Email Address Row */}
          <TouchableOpacity style={styles.rowItem} onPress={() => setActiveModal('email')} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="mail-outline" size={20} color="#0F2942" style={styles.icon} />
              <View>
                <View style={styles.inlineHeaderRow}>
                  <Text style={styles.rowTitle}>Email Address</Text>
                  {isGoogleAccount ? (
                    <View style={styles.googleInlineBadge}>
                      <Ionicons name="logo-google" size={10} color="#EA4335" />
                      <Text style={styles.googleInlineText}>Verified by Google</Text>
                    </View>
                  ) : (
                    emailVerified && (
                      <View style={styles.verifiedPill}>
                        <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
                        <Text style={styles.verifiedPillText}>Verified</Text>
                      </View>
                    )
                  )}
                </View>
                <Text style={styles.rowSubtitle}>{userEmail}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Regional Market Row */}
          <TouchableOpacity style={styles.rowItem} onPress={() => setActiveModal('market')} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="location-outline" size={20} color="#0F2942" style={styles.icon} />
              <View>
                <Text style={styles.rowTitle}>Regional Market</Text>
                <Text style={styles.rowSubtitle}>{currentCountry}</Text>
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
            onPress={() => setActiveModal('currency')}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="cash-outline" size={20} color="#0F2942" style={styles.icon} />
              <Text style={styles.rowTitle}>Currency</Text>
            </View>
            <Text style={styles.rowValue}>{currentCurrency.split(' ')[0]}</Text>
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => setActiveModal('language')}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="language-outline" size={20} color="#0F2942" style={styles.icon} />
              <Text style={styles.rowTitle}>Language</Text>
            </View>
            <Text style={styles.rowValue}>{currentLang}</Text>
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => setActiveModal('measurement')}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="speedometer-outline" size={20} color="#0F2942" style={styles.icon} />
              <Text style={styles.rowTitle}>Measurement System</Text>
            </View>
            <Text style={styles.rowValue}>{measurementSystem.split(' ')[0]}</Text>
          </TouchableOpacity>
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

          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => setActiveModal('security')}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0F2942" style={styles.icon} />
              <Text style={styles.rowTitle}>Security & Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. Sign Out Button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => setActiveModal('logout')}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color="#C92A2A" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* ========================================================================= */}
      {/* DETAILED & REALISTIC MODALS */}
      {/* ========================================================================= */}

      {/* Modal 1: Detailed Personal Profile */}
      <Modal visible={activeModal === 'profile'} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalSheet}>
                <View style={styles.grabBar} />
                <Text style={styles.modalTitle}>Personal Profile</Text>

                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 440 }}>
                  {/* Avatar Banner Header */}
                  <View style={styles.avatarEditBanner}>
                    <View style={styles.avatarCircleLarge}>
                      <Text style={styles.avatarTextLarge}>
                        {editFirstName[0]}
                        {editLastName[0]}
                      </Text>
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.avatarBannerTitle}>Profile Avatar</Text>
                        {isGoogleAccount && (
                          <View style={styles.googleInlineBadge}>
                            <Ionicons name="logo-google" size={10} color="#EA4335" />
                            <Text style={styles.googleInlineText}>Google</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.avatarBannerSub}>VIP Automotive Member</Text>
                    </View>
                  </View>

                  {/* Google Uneditable Notice Banner */}
                  {isGoogleAccount && (
                    <View style={styles.googleLockedBanner}>
                      <Ionicons name="lock-closed" size={16} color="#0F2942" />
                      <Text style={styles.googleLockedText}>
                        First Name, Last Name, and Primary Email are synced & locked by your Google Account.
                      </Text>
                    </View>
                  )}

                  {/* First & Last Name Inputs (Uneditable if Google) */}
                  <View style={styles.flexRowInputs}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <View style={styles.labelWithGoogleRow}>
                        <Text style={styles.inputLabel}>First Name</Text>
                        {isGoogleAccount && <Ionicons name="logo-google" size={12} color="#EA4335" />}
                      </View>
                      <TextInput
                        style={[styles.textInput, isGoogleAccount && styles.disabledInput]}
                        value={editFirstName}
                        onChangeText={setEditFirstName}
                        editable={!isGoogleAccount}
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <View style={styles.labelWithGoogleRow}>
                        <Text style={styles.inputLabel}>Last Name</Text>
                        {isGoogleAccount && <Ionicons name="logo-google" size={12} color="#EA4335" />}
                      </View>
                      <TextInput
                        style={[styles.textInput, isGoogleAccount && styles.disabledInput]}
                        value={editLastName}
                        onChangeText={setEditLastName}
                        editable={!isGoogleAccount}
                      />
                    </View>
                  </View>

                  {/* Phone Input with Country Code */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Mobile Phone Number</Text>
                    <View style={styles.phoneInputRow}>
                      <View style={styles.countryCodeBadge}>
                        <Text style={styles.countryCodeText}>🇪🇬 +20</Text>
                      </View>
                      <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        value={editPhone}
                        onChangeText={setEditPhone}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  {/* Governorate / City */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Governorate / City</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editCity}
                      onChangeText={setEditCity}
                      placeholder="e.g. Cairo, Alexandria, 6th of October"
                    />
                  </View>

                  {/* Driver Persona Chips */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Automotive Status</Text>
                    <View style={styles.chipsRow}>
                      {['Car Owner 🚗', 'Looking to Buy 🛒', 'Enthusiast 🏎️'].map((persona) => {
                        const isSelected = editPersona === persona;
                        return (
                          <TouchableOpacity
                            key={persona}
                            style={[
                              styles.personaChip,
                              isSelected ? styles.personaChipActive : styles.personaChipInactive,
                            ]}
                            onPress={() => setEditPersona(persona)}
                          >
                            <Text
                              style={[
                                styles.personaChipText,
                                isSelected ? styles.personaChipTextActive : styles.personaChipTextInactive,
                              ]}
                            >
                              {persona}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </ScrollView>

                <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                  <Text style={styles.saveButtonText}>Save Profile Changes</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal 2: Detailed Email & Verification */}
      <Modal visible={activeModal === 'email'} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalSheet}>
                <View style={styles.grabBar} />
                <Text style={styles.modalTitle}>Email & Notifications</Text>

                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 440 }}>
                  {/* Current Verified Email Card */}
                  <View style={styles.verifiedEmailCard}>
                    <View style={styles.verifiedEmailHeader}>
                      <Ionicons name="mail" size={22} color="#0F2942" />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.verifiedEmailLabel}>Primary Account Email</Text>
                          {isGoogleAccount && <Ionicons name="logo-google" size={12} color="#EA4335" />}
                        </View>
                        <Text style={styles.verifiedEmailValue}>{userEmail}</Text>
                      </View>
                      <View style={styles.greenCheckBadge}>
                        <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
                        <Text style={styles.greenCheckText}>
                          {isGoogleAccount ? 'Google Verified' : 'Verified'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.verifiedEmailSub}>
                      Used for security alerts, price drop notifications, and garage updates.
                    </Text>
                  </View>

                  {/* Change Email Section */}
                  <Text style={styles.subHeaderTitle}>
                    {isGoogleAccount ? 'Primary Email Address' : 'Change Primary Email'}
                  </Text>

                  {isGoogleAccount ? (
                    <View style={styles.googleLockedBanner}>
                      <Ionicons name="logo-google" size={16} color="#EA4335" />
                      <Text style={styles.googleLockedText}>
                        Your primary email address is verified and managed directly by your Google Account.
                      </Text>
                    </View>
                  ) : (
                    <>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>New Email Address</Text>
                        <TextInput
                          style={styles.textInput}
                          value={newEmailInput}
                          onChangeText={setNewEmailInput}
                          placeholder="e.g. name@domain.com"
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Confirm New Email</Text>
                        <TextInput
                          style={styles.textInput}
                          value={confirmEmailInput}
                          onChangeText={setConfirmEmailInput}
                          placeholder="Re-enter new email"
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>

                      {!otpSent ? (
                        <TouchableOpacity style={styles.outlineActionButton} onPress={handleSendEmailVerification}>
                          <Text style={styles.outlineActionText}>Send Verification OTP Code</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.otpSection}>
                          <Text style={styles.otpNotice}>
                            Enter 6-digit code sent to <Text style={{ fontWeight: '700' }}>{newEmailInput}</Text>
                          </Text>
                          <View style={styles.otpRow}>
                            {['4', '8', '2', '9', '1', '0'].map((digit, i) => (
                              <View key={i} style={styles.otpBox}>
                                <Text style={styles.otpDigit}>{digit}</Text>
                              </View>
                            ))}
                          </View>
                          <TouchableOpacity style={styles.saveButton} onPress={confirmNewEmail}>
                            <Text style={styles.saveButtonText}>Confirm & Update Email</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}

                  {/* Email Subscriptions */}
                  <Text style={[styles.subHeaderTitle, { marginTop: 24 }]}>Email Subscriptions</Text>

                  <View style={styles.toggleRowItem}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={styles.toggleRowTitle}>MENA Market Digest</Text>
                      <Text style={styles.toggleRowSub}>Weekly automotive price insights & EV news</Text>
                    </View>
                    <Switch
                      value={digestSubscription}
                      onValueChange={setDigestSubscription}
                      trackColor={{ false: '#D1D5DB', true: '#0F2942' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal 3: Select Regional Market */}
      <Modal visible={activeModal === 'market'} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalSheet}>
                <View style={styles.grabBar} />
                <Text style={styles.modalTitle}>Select Regional Market</Text>

                {['Egypt 🇪🇬', 'United Arab Emirates 🇦🇪', 'Saudi Arabia 🇸🇦', 'Kuwait 🇰🇼'].map((country) => {
                  const isSelected = currentCountry === country;
                  return (
                    <TouchableOpacity
                      key={country}
                      style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                      onPress={() => {
                        setCurrentCountry(country);
                        setActiveModal(null);
                      }}
                    >
                      <Text style={[styles.radioText, isSelected && styles.radioTextSelected]}>{country}</Text>
                      {isSelected && <Ionicons name="checkmark-circle" size={22} color="#0F2942" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal 4: Select Currency */}
      <Modal visible={activeModal === 'currency'} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalSheet}>
                <View style={styles.grabBar} />
                <Text style={styles.modalTitle}>Select Currency</Text>

                {[
                  'EGP (Egyptian Pound £)',
                  'USD (US Dollar $)',
                  'AED (UAE Dirham)',
                  'SAR (Saudi Riyal)',
                  'EUR (Euro €)',
                ].map((curr) => {
                  const isSelected = currentCurrency === curr;
                  return (
                    <TouchableOpacity
                      key={curr}
                      style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                      onPress={() => {
                        setCurrentCurrency(curr);
                        setActiveModal(null);
                      }}
                    >
                      <Text style={[styles.radioText, isSelected && styles.radioTextSelected]}>{curr}</Text>
                      {isSelected && <Ionicons name="checkmark-circle" size={22} color="#0F2942" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal 5: Select Language */}
      <Modal visible={activeModal === 'language'} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalSheet}>
                <View style={styles.grabBar} />
                <Text style={styles.modalTitle}>Select Language</Text>

                {['English', 'العربية'].map((lang) => {
                  const isSelected = currentLang === lang;
                  return (
                    <TouchableOpacity
                      key={lang}
                      style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                      onPress={() => {
                        setCurrentLang(lang);
                        setActiveModal(null);
                      }}
                    >
                      <Text style={[styles.radioText, isSelected && styles.radioTextSelected]}>{lang}</Text>
                      {isSelected && <Ionicons name="checkmark-circle" size={22} color="#0F2942" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal 6: Select Measurement System */}
      <Modal visible={activeModal === 'measurement'} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalSheet}>
                <View style={styles.grabBar} />
                <Text style={styles.modalTitle}>Select Measurement System</Text>

                {['Metric (km, kW, Nm)', 'Imperial (mi, HP, lb-ft)'].map((system) => {
                  const isSelected = measurementSystem === system;
                  return (
                    <TouchableOpacity
                      key={system}
                      style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                      onPress={() => {
                        setMeasurementSystem(system);
                        setActiveModal(null);
                      }}
                    >
                      <Text style={[styles.radioText, isSelected && styles.radioTextSelected]}>{system}</Text>
                      {isSelected && <Ionicons name="checkmark-circle" size={22} color="#0F2942" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal 7: Security & Password */}
      <Modal visible={activeModal === 'security'} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalSheet}>
                <View style={styles.grabBar} />
                <Text style={styles.modalTitle}>Security & Password</Text>

                {isGoogleAccount ? (
                  <View style={styles.googleLockedBanner}>
                    <Ionicons name="logo-google" size={16} color="#EA4335" />
                    <Text style={styles.googleLockedText}>
                      Your account uses Google Authentication. Security and password settings are managed directly through Google.
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Current Password</Text>
                      <TextInput
                        style={styles.textInput}
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="••••••••"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>New Password</Text>
                      <TextInput
                        style={styles.textInput}
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                      />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={savePassword}>
                      <Text style={styles.saveButtonText}>Update Password</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal 8: Logout Confirmation */}
      <Modal visible={activeModal === 'logout'} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.dialogCard}>
                <View style={styles.logoutIconCircle}>
                  <Ionicons name="log-out-outline" size={28} color="#C92A2A" />
                </View>

                <Text style={styles.dialogTitle}>Sign Out of AutoVersus?</Text>
                <Text style={styles.dialogSubtitle}>
                  You can sign back in anytime to access your saved garage and price alerts.
                </Text>

                <View style={styles.dialogButtonsRow}>
                  <TouchableOpacity
                    style={styles.dialogCancelBtn}
                    onPress={() => setActiveModal(null)}
                  >
                    <Text style={styles.dialogCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.dialogConfirmBtn} onPress={handleLogout}>
                    <Text style={styles.dialogConfirmText}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    position: 'relative',
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
    gap: 8,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  googleBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  googleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F2942',
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
  editProfileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
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
  inlineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  googleInlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  googleInlineText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  verifiedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
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
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 20,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C92A2A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  grabBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F2942',
    marginBottom: 16,
  },
  avatarEditBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    gap: 14,
  },
  avatarCircleLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F2942',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTextLarge: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F2942',
  },
  avatarBannerSub: {
    fontSize: 12,
    color: '#64748B',
  },
  googleLockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 16,
    gap: 10,
  },
  googleLockedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
    flex: 1,
    lineHeight: 16,
  },
  labelWithGoogleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flexRowInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  inputGroup: {
    gap: 6,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: '#0F2942',
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    color: '#64748B',
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F2942',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  personaChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  personaChipActive: {
    backgroundColor: '#0F2942',
    borderColor: '#0F2942',
  },
  personaChipInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  personaChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  personaChipTextActive: {
    color: '#FFFFFF',
  },
  personaChipTextInactive: {
    color: '#4B5563',
  },
  saveButton: {
    backgroundColor: '#0F2942',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  verifiedEmailCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  verifiedEmailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  verifiedEmailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  verifiedEmailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F2942',
  },
  greenCheckBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  greenCheckText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  verifiedEmailSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  subHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F2942',
    marginBottom: 12,
  },
  outlineActionButton: {
    borderWidth: 1.5,
    borderColor: '#0F2942',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  outlineActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F2942',
  },
  otpSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
  },
  otpNotice: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 12,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  otpBox: {
    width: 38,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F2942',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F2942',
  },
  toggleRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
  },
  toggleRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F2942',
  },
  toggleRowSub: {
    fontSize: 12,
    color: '#64748B',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  radioRowSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  radioText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  radioTextSelected: {
    fontWeight: '700',
    color: '#0F2942',
  },
  dialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    marginHorizontal: 32,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  logoutIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F2942',
    marginBottom: 8,
    textAlign: 'center',
  },
  dialogSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  dialogButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dialogCancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  dialogCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  dialogConfirmBtn: {
    flex: 1,
    backgroundColor: '#C92A2A',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  dialogConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
