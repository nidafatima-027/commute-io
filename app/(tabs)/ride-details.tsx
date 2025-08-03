import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, Car, Users, MessageCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import RideRequestModal from '@/components/RideRequestModal';
import { ridesAPI } from '@/services/api'; // Adjust the import path as needed
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';


export default function RideDetailsScreen() {
  const params = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already_requested'>('idle');
const [errorMessage, setErrorMessage] = useState('');
const [additionalInfo, setAdditionalInfo] = useState<{ requestedAt?: string } | null>(null);
  const [hasRequested, setHasRequested] = useState(false);
  const [joiningStop, setJoiningStop] = useState('');
  const [endingStop, setEndingStop] = useState('');
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const startLat = parseFloat(params.start_Latitude as string);
  const startLng = parseFloat(params.start_Longitude as string);
  const endLat = parseFloat(params.end_Latitude as string);
  const endLng = parseFloat(params.end_Longitude as string);
  const mapRef = useRef<MapView>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapHeight, setMapHeight] = useState(200);


useEffect(() => {
  if (rideDetails.rideStops && rideDetails.rideStops.length > 0) {
    setJoiningStop(rideDetails.rideStops[0]);
    setEndingStop(rideDetails.rideStops[rideDetails.rideStops.length - 1]);
  }
    const checkExistingRequest = async () => {
      try {
        const rideId = parseInt(params.ride as string);
        const response = await ridesAPI.checkExistingRequest(rideId);
        
        if (response.exists) {
          setHasRequested(true);
          setRequestStatus('already_requested');
          setAdditionalInfo({
            requestedAt: formatRequestTime(response.requested_at ?? '')
          });
        }
      } catch (error) {
        console.log('Error checking existing request:', error);
        // Don't show error to user - just proceed as if no request exists
      }
    };

    checkExistingRequest();
  }, [params.ride]);

useEffect(() => {
    // Calculate initial region when coordinates are available
    console.log('Start Coordinates:', startLat, startLng);
    console.log('End Coordinates:', endLat, endLng);
    if (startLat && startLng && endLat && endLng) {
      const coordinates = [
        { latitude: startLat, longitude: startLng },
        { latitude: endLat, longitude: endLng },
      ];
      
      setRouteCoordinates(coordinates);
      
      // Calculate region that fits both points
      const minLat = Math.min(startLat, endLat);
      const maxLat = Math.max(startLat, endLat);
      const minLng = Math.min(startLng, endLng);
      const maxLng = Math.max(startLng, endLng);
      
      setRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: (maxLat - minLat) * 1.5, // Add some padding
        longitudeDelta: (maxLng - minLng) * 1.5,
      });
    }
  }, [startLat, startLng, endLat, endLng]);

const fitToCoordinates = () => {
    if (mapRef.current && isMapReady && startLat && startLng && endLat && endLng) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: startLat, longitude: startLng },
          { latitude: endLat, longitude: endLng }
        ],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true
        }
      );
    }
  };

 useEffect(() => {
    if (isMapReady) {
      fitToCoordinates();
    }
  }, [isMapReady, startLat, startLng, endLat, endLng]);

  const handleBack = () => {
    router.back();
  };

const formatRequestTime = (timestamp: string): string => {
  if (!timestamp) return 'Unknown time';
  
  const date = new Date(timestamp);
  
  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Unknown time';
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};


  const handleRequestRide = async () => {
  if (hasRequested) return;
  if (!joiningStop || !endingStop) {
      setRequestStatus('error');
      setErrorMessage('Please select both joining and ending stops');
      setShowModal(true);
      return;
  }
    
  if (joiningStop === endingStop) {
      setRequestStatus('error');
      setErrorMessage('Joining and ending stops cannot be the same');
      setShowModal(true);
      return;
  }

  setRequestStatus('loading');
  setShowModal(true);

  try {
    const rideId = parseInt(params.ride as string); 
    const response = await ridesAPI.requestRide(rideId,
        joiningStop, endingStop, "Please accept my ride request", 
      );
    setRequestStatus('success');
    setHasRequested(true);
  } catch (error: any) {
    try {
      // Parse the error if it's a stringified JSON
      const errorObj = typeof error === 'string' ? JSON.parse(error) : error;
      console.log('Full error:', errorObj);
      
      // Extract error details with fallbacks
      const errorResponse = errorObj.message || {};
      const errorData = errorResponse || {};
      const statusCode = errorObj.response.status || 500;

      // Handle duplicate request case
      if (errorData.code === 'duplicate_request') {
        console.log('Duplicate request detected:', errorData);
        setRequestStatus('already_requested');
        setErrorMessage(
          typeof errorData.message === 'string' 
            ? errorData.message 
            : 'You have already requested this ride'
        );
        setAdditionalInfo({
          requestedAt: errorData.metadata?.requested_at
            ? formatRequestTime(errorData.metadata.requested_at)
            : "Unknown time"
        });
      } 
      // Handle other error cases
      else {
        setRequestStatus('error');
        setErrorMessage(
          typeof errorData.message === 'string' ? errorData.message :
          typeof errorData.detail === 'string' ? errorData.detail :
          statusCode === 500 ? 'Server error' : 'Request failed'
        );
      }
    } catch (parseError) {
      console.error('Error parsing error:', parseError);
      setRequestStatus('error');
      setErrorMessage('An unexpected error occurred');
    }
  }
};


  const handleModalClose = () => {
    setShowModal(false);
    // Navigate back to search or home after successful request
    router.push('/(tabs)');
  };

  const handleMessage = () => {
    // Navigate to messages with this driver
    console.log(rideDetails.driverId)
    console.log(params.ride as string)
    router.push({
      pathname: '/(tabs)/message_inbox',
      params: {
        name: rideDetails.driverName,
        image: rideDetails.driverImage,
        userId: rideDetails.driverId.toString(),
        rideId: params.ride as string, // Pass the ride ID
        rideRoute: `${rideDetails.fromLocation} to ${rideDetails.toLocation}`,
      },
    });
  };

  // Use params if available, otherwise use default data
  const rideDetails = {
    driverName: params.driverName as string || 'Ethan Carter',
    driverId: parseInt(params.driverId as string) || 1,
    driverRating: parseFloat(params.driverRating as string) || 4.8,
    driverRides: parseInt(params.driverRides as string) || 12,
    driverImage: params.driverImage as string || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    fromLocation: params.fromLocation as string || 'Campus',
    fromAddress: params.fromAddress as string || '123 University Ave',
    toLocation: params.toLocation as string || 'Home',
    toAddress: params.toAddress as string || '456 Main St',
    departureTime: params.departureTime as string || '10:00 AM',
    vehicle: params.vehicle as string || 'Toyota Camry',
    seatsAvailable: parseInt(params.seatsAvailable as string) || 4,
    price: params.price as string || 'RS150',
    rideStops: params.rideStops ? JSON.parse(params.rideStops as string) : [
    params.fromLocation as string || 'Campus',
    params.toLocation as string || 'Home'
  ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setMapHeight(200)} // Reset height when scrolling
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Ride Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Driver Info */}
          <View style={styles.driverSection}>
            <View style={styles.driverImageContainer}>
              <Image 
                source={{ uri: rideDetails.driverImage }} 
                style={styles.driverImage} 
              />
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{rideDetails.driverName}</Text>
              <Text style={styles.driverRole}>Driver</Text>
              <Text style={styles.driverStats}>
                {rideDetails.driverRating} • {rideDetails.driverRides} rides
              </Text>
            </View>
          </View>

          {/* Route Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route</Text>
            
            <View style={styles.routeItem}>
              <View style={styles.routeIcon}>
                <MapPin size={20} color="#4ECDC4" />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLocation}>{rideDetails.fromLocation}</Text>
                <Text style={styles.routeAddress}>{rideDetails.fromAddress}</Text>
              </View>
            </View>

            <View style={styles.routeItem}>
              <View style={styles.routeIcon}>
                <MapPin size={20} color="#4ECDC4" />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLocation}>{rideDetails.toLocation}</Text>
                <Text style={styles.routeAddress}>{rideDetails.toAddress}</Text>
              </View>
            </View>

            {/* Stop Selection */}
            <View style={styles.stopSelectionContainer}>
              <View style={styles.stopPickerContainer}>
                <Text style={styles.stopPickerLabel}>Joining Stop</Text>
                <View style={[
                  styles.pickerWrapper,
                  hasRequested && styles.disabledPicker
                ]}>
                  <Picker
                    selectedValue={joiningStop}
                    onValueChange={(itemValue) => setJoiningStop(itemValue)}
                    enabled={!hasRequested}
                    style={styles.picker}
                  >
                    {rideDetails.rideStops && rideDetails.rideStops.length > 0 ? (
                      rideDetails.rideStops.map((stop: string) => (
                        <Picker.Item 
                          key={stop} 
                          label={`${stop}`} 
                          value={stop} 
                        />
                      ))
                    ) : (
                      <Picker.Item 
                        label="No stops available" 
                        value="" 
                      />
                    )}
                  </Picker>
                </View>
              </View>

              <View style={styles.stopPickerContainer}>
                <Text style={styles.stopPickerLabel}>Ending Stop</Text>
                <View style={[
                  styles.pickerWrapper,
                  hasRequested && styles.disabledPicker
                ]}>
                  <Picker
                    selectedValue={endingStop}
                    onValueChange={(itemValue) => setEndingStop(itemValue)}
                    enabled={!hasRequested}
                    style={styles.picker}
                  >
                    {rideDetails.rideStops && rideDetails.rideStops.length > 0 ? (
                      rideDetails.rideStops.map((stop: string) => (
                        <Picker.Item 
                          key={stop} 
                          label={`${stop}`} 
                          value={stop} 
                        />
                      ))
                    ) : (
                      <Picker.Item 
                        label="No stops available" 
                        value="" 
                      />
                    )}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Map Preview */}
            <TouchableOpacity 
          activeOpacity={1}
          style={[styles.mapContainer, { height: mapHeight }]}
          onPress={() => setMapHeight(Dimensions.get('window').height * 0.7)}
        >
          {startLat && startLng && endLat && endLng ? (
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={region}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={false}
              rotateEnabled={false}
              onMapReady={() => {
                setIsMapReady(true);
                fitToCoordinates();
              }}
              onLayout={fitToCoordinates}
            >
              {/* Start Marker */}
              <Marker
                coordinate={{ latitude: startLat, longitude: startLng }}
                title="Pickup Location"
                description={rideDetails.fromLocation}
              >
                <View style={styles.startMarker}>
                  <MapPin size={20} color="#4ECDC4" />
                </View>
              </Marker>
              
              {/* End Marker */}
              <Marker
                coordinate={{ latitude: endLat, longitude: endLng }}
                title="Drop-off Location"
                description={rideDetails.toLocation}
              >
                <View style={styles.endMarker}>
                  <MapPin size={20} color="#FF6B6B" />
                </View>
              </Marker>
              
              {/* Route Line */}
              {routeCoordinates.length >= 2 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="#4ECDC4"
                  strokeWidth={3}
                />
              )}
            </MapView>
          ) : (
            <Text>Map data not available</Text>
          )}
        </TouchableOpacity>
          </View>

          {/* Ride Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ride Information</Text>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Clock size={20} color="#4ECDC4" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Departure Time</Text>
                  <Text style={styles.infoValue}>{rideDetails.departureTime}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Car size={20} color="#4ECDC4" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Vehicle</Text>
                  <Text style={styles.infoValue}>{rideDetails.vehicle}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Users size={20} color="#4ECDC4" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Seats Available</Text>
                  <Text style={styles.infoValue}>{rideDetails.seatsAvailable}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[
                styles.requestButton,
                hasRequested && styles.requestButtonDisabled
              ]} 
              onPress={handleRequestRide}
              disabled={hasRequested}
            >
              <Text style={styles.requestButtonText}>
                {hasRequested ? 'Already Requested' : 'Request Ride'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
              <MessageCircle size={20} color="#4ECDC4" />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price per seat</Text>
            <Text style={styles.priceValue}>{rideDetails.price}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Ride Request Modal */}
      <RideRequestModal 
        visible={showModal} 
        onClose={handleModalClose}
        status={requestStatus}
        errorMessage={errorMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  driverSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  driverImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  driverImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  driverInfo: {
    alignItems: 'center',
  },
  driverName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  driverRole: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  driverStats: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  routeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeLocation: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  stopSelectionContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  stopPickerContainer: {
    marginBottom: 16,
  },
  stopPickerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2d3748',
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
  disabledPicker: {
    backgroundColor: '#f3f4f6',
    opacity: 0.7,
  },
  mapContainer: {
    height: 200, // Initial height
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  startMarker: {
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  endMarker: {
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ECDC4',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  requestButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  requestButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 18,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  messageButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  priceContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#4ECDC4',
  },
  requestButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowColor: '#cccccc',
  },
});