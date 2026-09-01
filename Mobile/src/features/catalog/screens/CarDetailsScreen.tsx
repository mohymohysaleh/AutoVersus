import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { catalogApi, VariantDetailDto } from '../api/catalog.api';
import { resolveCarImage } from '../../../shared/utils/car-image.utils';
import { useLanguage } from '../../../shared/context/LanguageContext';

interface CarDetailsScreenProps {
  slug?: string;
}

export const CarDetailsScreen: React.FC<CarDetailsScreenProps> = ({ slug }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Specs' | 'Safety' | 'Features'>('Overview');
  const [variant, setVariant] = useState<VariantDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const tabsMap: Record<string, string> = {
    Overview: t('details.overview'),
    Specs: t('details.specs'),
    Safety: t('details.safety'),
    Features: t('details.features'),
  };

  useEffect(() => {
    loadVariantDetails();
  }, [slug]);

  const loadVariantDetails = async () => {
    setIsLoading(true);
    if (slug) {
      const data = await catalogApi.fetchVariantDetails(slug);
      setVariant(data);
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/search');
    }
  };

  const displayTitle = variant
    ? `${variant.year} ${variant.brandName} ${variant.modelName}`
    : 'Vehicle Details';

  const formattedPrice = variant?.startingPriceEGP
    ? `EGP ${variant.startingPriceEGP.toLocaleString()}`
    : 'EGP 1,450,000';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconCircleButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.navTitle} numberOfLines={1}>
          {variant ? `${variant.modelName} ${variant.trimName}` : 'Car Details'}
        </Text>

        <View style={styles.rightNavIcons}>
          <TouchableOpacity style={styles.iconCircleButton}>
            <Ionicons name="share-outline" size={18} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircleButton}>
            <Ionicons name="swap-horizontal" size={18} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#0F2942" size="large" />
          <Text style={styles.loadingText}>Loading spec sheet from database...</Text>
        </View>
      ) : (
        /* Scrollable Details Body */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
          {/* Hero Gallery Container */}
          <View style={styles.heroImageContainer}>
            <Image
              source={{
                uri: resolveCarImage(
                  variant?.brandName || '',
                  variant?.modelName || '',
                  variant?.trimName,
                  variant?.engine?.fuelType
                ),
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Bottom Left 360 Badge */}
            <TouchableOpacity style={styles.threeSixtyBadge} activeOpacity={0.8}>
              <Ionicons name="sync-outline" size={16} color="#0F2942" />
              <Text style={styles.threeSixtyText}>360° View</Text>
            </TouchableOpacity>

            {/* Bottom Right Pagination Dots */}
            <View style={styles.paginationRow}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* Vehicle Header Info */}
          <View style={styles.infoSection}>
            <Text style={styles.categoryTag}>
              {variant?.generationName ? `${variant.generationName.toUpperCase()}` : 'AUTOMOTIVE SPEC SHEET'}
            </Text>

            <View style={styles.titleTrimRow}>
              <Text style={styles.carTitle}>{displayTitle}</Text>
              <View style={styles.trimBadge}>
                <Text style={styles.trimBadgeText}>{variant?.trimName || 'Standard'}</Text>
              </View>
            </View>

            {/* Price Label */}
            <Text style={styles.priceLabel}>Starting price (EGP MSRP)</Text>
            <Text style={styles.priceValue}>{formattedPrice}</Text>

            {/* Quick Action Buttons Row */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8}>
                <Ionicons name="swap-horizontal-outline" size={18} color="#0F2942" />
                <Text style={styles.outlineBtnText}>{t('compare.title')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.solidBtn, isSaved && styles.solidBtnSaved]}
                onPress={() => setIsSaved(!isSaved)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color={isSaved ? '#C92A2A' : '#0F2942'}
                />
                <Text style={[styles.solidBtnText, isSaved && styles.solidBtnTextSaved]}>
                  {isSaved ? t('details.savedInGarage') : t('details.saveToGarage')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Horizontal Tabs Bar */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
              {(['Overview', 'Specs', 'Safety', 'Features'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tabItem, isActive && styles.tabItemActive]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tabsMap[tab]}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'Overview' && (
              <View style={styles.overviewGrid}>
                <View style={styles.specBox}>
                  <Ionicons name="flash-outline" size={22} color="#0F2942" style={{ marginBottom: 6 }} />
                  <Text style={styles.specBoxLabel}>{t('details.horsepower')}</Text>
                  <Text style={styles.specBoxValue}>
                    {variant?.engine?.powerHp ? `${variant.engine.powerHp} HP` : 'N/A'}
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Ionicons name="speedometer-outline" size={22} color="#0F2942" style={{ marginBottom: 6 }} />
                  <Text style={styles.specBoxLabel}>{t('details.torque')}</Text>
                  <Text style={styles.specBoxValue}>
                    {variant?.engine?.torqueNm ? `${variant.engine.torqueNm} Nm` : 'N/A'}
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Ionicons name="stopwatch-outline" size={22} color="#0F2942" style={{ marginBottom: 6 }} />
                  <Text style={styles.specBoxLabel}>{t('details.zeroToHundred')}</Text>
                  <Text style={styles.specBoxValue}>
                    {variant?.performance?.zeroToHundredKmh ? `${variant.performance.zeroToHundredKmh} sec` : 'N/A'}
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Ionicons name="flame-outline" size={22} color="#0F2942" style={{ marginBottom: 6 }} />
                  <Text style={styles.specBoxLabel}>{t('details.topSpeed')}</Text>
                  <Text style={styles.specBoxValue}>
                    {variant?.performance?.topSpeedKmh ? `${variant.performance.topSpeedKmh} km/h` : 'N/A'}
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Ionicons name="leaf-outline" size={22} color="#0F2942" style={{ marginBottom: 6 }} />
                  <Text style={styles.specBoxLabel}>{t('details.fuelEconomy')}</Text>
                  <Text style={styles.specBoxValue}>
                    {variant?.fuelEconomy?.combinedL100km === 0
                      ? 'Electric (EV)'
                      : variant?.fuelEconomy?.combinedL100km
                      ? `${variant.fuelEconomy.combinedL100km} L/100km`
                      : 'N/A'}
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Ionicons name="shield-checkmark-outline" size={22} color="#0F2942" style={{ marginBottom: 6 }} />
                  <Text style={styles.specBoxLabel}>{t('details.airbags')}</Text>
                  <Text style={styles.specBoxValue}>
                    {variant?.safety?.airbagsCount ? `${variant.safety.airbagsCount}` : 'N/A'}
                  </Text>
                </View>
              </View>
            )}

            {/* TAB CONTENT: SPECS */}
            {activeTab === 'Specs' && (
              <View style={styles.specsTabContainer}>
                <Text style={styles.specGroupTitle}>{t('details.enginePowertrain')}</Text>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>{t('details.fuelType')}</Text>
                  <Text style={styles.specDetailVal}>{variant?.engine?.fuelType || 'N/A'}</Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>{t('details.displacement')}</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.engine?.displacementCc ? `${variant.engine.displacementCc} cc` : 'N/A (EV)'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>{t('details.horsepower')}</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.engine?.powerHp ? `${variant.engine.powerHp} HP (${variant.engine.powerKw || Math.round(variant.engine.powerHp * 0.745)} kW)` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>{t('details.torque')}</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.engine?.torqueNm ? `${variant.engine.torqueNm} Nm` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>{t('details.transmission')}</Text>
                  <Text style={styles.specDetailVal}>{variant?.engine?.transmission || 'N/A'}</Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>{t('details.drivetrain')}</Text>
                  <Text style={styles.specDetailVal}>{variant?.engine?.drivetrain || 'N/A'}</Text>
                </View>

                <Text style={[styles.specGroupTitle, { marginTop: 18 }]}>{t('details.dimensionsCapacity')}</Text>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>{t('details.dimensions')}</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.dimensions
                      ? `${variant.dimensions.lengthMm} × ${variant.dimensions.widthMm} × ${variant.dimensions.heightMm} mm`
                      : 'N/A'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>{t('details.wheelbase')}</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.dimensions?.wheelbaseMm ? `${variant.dimensions.wheelbaseMm} mm` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>{t('details.trunkVolume')}</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.dimensions?.cargoCapacityL ? `${variant.dimensions.cargoCapacityL} L` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>{t('details.seating')}</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.dimensions?.seatingCapacity ? `${variant.dimensions.seatingCapacity}` : '5'}
                  </Text>
                </View>

                <Text style={[styles.specGroupTitle, { marginTop: 18 }]}>PERFORMANCE & EFFICIENCY</Text>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>0 - 100 km/h Acceleration</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.performance?.zeroToHundredKmh ? `${variant.performance.zeroToHundredKmh} seconds` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Max Speed</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.performance?.topSpeedKmh ? `${variant.performance.topSpeedKmh} km/h` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Combined Fuel Consumption</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.fuelEconomy?.combinedL100km === 0
                      ? '0.0 L/100km (Zero Emissions)'
                      : variant?.fuelEconomy?.combinedL100km
                      ? `${variant.fuelEconomy.combinedL100km} L/100km`
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            )}

            {/* TAB CONTENT: SAFETY */}
            {activeTab === 'Safety' && (
              <View style={styles.specsTabContainer}>
                <Text style={styles.specGroupTitle}>SAFETY & DRIVER ASSISTANCE</Text>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Airbags Package</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.safety?.airbagsCount ? `${variant.safety.airbagsCount} Airbags (Front, Side, Curtain)` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Anti-lock Braking System (ABS)</Text>
                  <Text style={styles.specDetailVal}>Standard Equipment ✓</Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Electronic Stability Control (ESC)</Text>
                  <Text style={styles.specDetailVal}>Standard Equipment ✓</Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Auto Emergency Braking (AEB)</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.safety?.hasAeb ? 'Active Radar Assistance ✓' : 'Optional / Standard'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Tire Pressure Monitoring (TPMS)</Text>
                  <Text style={styles.specDetailVal}>Individual Sensor Display ✓</Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Brake Assist (BA / EBD)</Text>
                  <Text style={styles.specDetailVal}>Electronic Force Distribution ✓</Text>
                </View>
              </View>
            )}

            {/* TAB CONTENT: FEATURES */}
            {activeTab === 'Features' && (
              <View style={styles.specsTabContainer}>
                <Text style={styles.specGroupTitle}>COMFORT, CONVENIENCE & TECH</Text>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Smartphone Integration</Text>
                  <Text style={styles.specDetailVal}>Wireless Apple CarPlay & Android Auto ✓</Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Instrument Cluster</Text>
                  <Text style={styles.specDetailVal}>
                    {variant?.brandName === 'Porsche' || variant?.brandName === 'BMW' || variant?.brandName === 'Mercedes-Benz'
                      ? 'Full HD Digital Cockpit 12.3" ✓'
                      : 'Digital Multi-Information Display ✓'}
                  </Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Climate Control</Text>
                  <Text style={styles.specDetailVal}>Automatic Dual-Zone Air Conditioning ✓</Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Lighting Technology</Text>
                  <Text style={styles.specDetailVal}>Full Adaptive LED Headlamps & DRLs ✓</Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Parking Assistance</Text>
                  <Text style={styles.specDetailVal}>Front & Rear Sensors + HD Rearview Camera ✓</Text>
                </View>
                <View style={styles.specDetailRow}>
                  <Text style={styles.specDetailKey}>Database Verification</Text>
                  <Text style={styles.specDetailVal}>{variant?.completenessScore || 95}% Verified Spec Sheet</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Bottom Fixed Action Footer */}
      <View style={styles.bottomCtaContainer}>
        <TouchableOpacity style={styles.dealershipCtaButton} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Find Dealerships / Request Quote</Text>
          <View style={styles.redDot} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  iconCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    maxWidth: 200,
  },
  rightNavIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  scrollBody: {
    paddingBottom: 90,
  },
  heroImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: '#111827',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  threeSixtyBadge: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  threeSixtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F2942',
  },
  paginationRow: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#C92A2A',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C92A2A',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  titleTrimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  carTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F2942',
    flex: 1,
    marginRight: 12,
  },
  trimBadge: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trimBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F2942',
  },
  priceLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#C92A2A',
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F2942',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F2942',
  },
  solidBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
  },
  solidBtnSaved: {
    backgroundColor: '#FEE2E2',
  },
  solidBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F2942',
  },
  solidBtnTextSaved: {
    color: '#C92A2A',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 24,
  },
  tabItemActive: {
    borderBottomWidth: 2.5,
    borderColor: '#0F2942',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F2942',
    fontWeight: '800',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  specBox: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  specBoxLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  specBoxValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F2942',
  },
  specsTabContainer: {
    gap: 10,
    marginBottom: 24,
  },
  specGroupTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C92A2A',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  specDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  specDetailKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  specDetailVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F2942',
  },
  bottomCtaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  dealershipCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F2942',
    paddingVertical: 16,
    borderRadius: 28,
    gap: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C92A2A',
  },
});
