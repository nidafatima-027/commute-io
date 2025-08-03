import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { router, useLocalSearchParams } from 'expo-router';
import { ridesAPI } from '../../services/api';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface Driver {
  id: number;
  name: string;
  phone: string;
  photo_url: string;
  driver_rating: number;
}

interface Car {
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
}

interface Ride {
  id: number;
  start_location: string;
  end_location: string;
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
  current_latitude?: number;
  current_longitude?: number;
  start_time: string;
  driver: Driver;
  car: Car;
}

export default function RiderRideInProgress() {
  const { rideId, requestId } = useLocalSearchParams();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [driverLocation, setDriverLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Fetch ride details
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const rideIdNumber = Array.isArray(rideId) ? Number(rideId[0]) : Number(rideId);
        const rideDetails = await ridesAPI.getRideDetails(rideIdNumber);
        setRide(rideDetails);
        
        // Set initial map region to show start and end points
        if (rideDetails) {
          setRegion({
            latitude: (rideDetails.start_latitude + rideDetails.end_latitude) / 2,
            longitude: (rideDetails.start_longitude + rideDetails.end_longitude) / 2,
            latitudeDelta: Math.abs(rideDetails.start_latitude - rideDetails.end_latitude) * 1.5,
            longitudeDelta: Math.abs(rideDetails.start_longitude - rideDetails.end_longitude) * 1.5,
          });
        }
      } catch (err) {
        setError('Failed to load ride details');
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  // Simulate driver location updates (in a real app, this would come from WebSocket or API polling)
  useEffect(() => {
    if (!ride) return;

    // Initial driver location (start point)
    setDriverLocation({
      latitude: ride.start_latitude,
      longitude: ride.start_longitude
    });

    // Simulate driver moving towards destination
    const interval = setInterval(() => {
      setDriverLocation(prev => {
        if (!prev) return null;
        
        // Simple linear interpolation between start and end points
        const progress = 0.01; // Adjust this value to change speed
        const newLat = prev.latitude + (ride.end_latitude - ride.start_latitude) * progress;
        const newLng = prev.longitude + (ride.end_longitude - ride.start_longitude) * progress;
        
        // Stop when close to destination
        if (Math.abs(newLat - ride.end_latitude) < 0.0001 && 
            Math.abs(newLng - ride.end_longitude) < 0.0001) {
          clearInterval(interval);
          return { latitude: ride.end_latitude, longitude: ride.end_longitude };
        }
        
        return { latitude: newLat, longitude: newLng };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ride]);

  const handleCallDriver = () => {
    if (ride?.driver.phone) {
      Linking.openURL(`tel:${ride.driver.phone}`);
    }
  };

  const handleMessageDriver = () => {
    // This would navigate to your chat screen with the driver
    // router.push(`/(tabs)/ride-chat?driverId=${ride?.driver.id}`);
 router.push({
      pathname: '/(tabs)/message_inbox',
      params: {
        userId: ride?.driver.id,
        name: ride?.driver.name,
        image: ride?.driver.photo_url,
        rideId: ride?.id,
        rideRoute: `${ride?.start_location} to ${ride?.end_location}`,
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading ride details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.container}>
        <Text>Ride not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Start Marker */}
          <Marker
            coordinate={{
              latitude: ride.start_latitude,
              longitude: ride.start_longitude
            }}
            title="Pickup Location"
            description={ride.start_location}
          >
            <View style={styles.marker}>
              <MaterialIcons name="location-on" size={30} color="#4ECDC4" />
            </View>
          </Marker>

          {/* End Marker */}
          <Marker
            coordinate={{
              latitude: ride.end_latitude,
              longitude: ride.end_longitude
            }}
            title="Drop-off Location"
            description={ride.end_location}
          >
            <View style={styles.marker}>
              <MaterialIcons name="location-on" size={30} color="#EF4444" />
            </View>
          </Marker>

          {/* Driver Marker */}
          {driverLocation && (
            <Marker
              coordinate={driverLocation}
              title="Driver"
              description={`En route to pickup`}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.driverMarker}>
                <MaterialIcons name="directions-car" size={30} color="#3B82F6" />
              </View>
            </Marker>
          )}

          {/* Route Polyline */}
          {driverLocation && (
            <Polyline
              coordinates={[
                { latitude: ride.start_latitude, longitude: ride.start_longitude },
                driverLocation,
                { latitude: ride.end_latitude, longitude: ride.end_longitude }
              ]}
              strokeColor="#3B82F6"
              strokeWidth={4}
              lineDashPattern={[5, 5]}
            />
          )}
        </MapView>
      </View>

      {/* Ride Info Card */}
      <View style={styles.rideInfoCard}>
        <View style={styles.driverInfo}>
          <Image
            source={{ uri: ride.driver.photo_url || 'https://i.imgur.com/T2WwVfS.png' }}
            style={styles.driverImage}
          />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{ride.driver.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{ride.driver.driver_rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.carInfo}>
          <MaterialIcons name="directions-car" size={24} color="#6B7280" />
          <Text style={styles.carText}>
            {ride.car.color} {ride.car.make} {ride.car.model} • {ride.car.license_plate}
          </Text>
        </View>

        <View style={styles.locationInfo}>
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>{ride.start_location}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.locationDotEnd]} />
            <Text style={styles.locationText}>{ride.end_location}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCallDriver}>
            <FontAwesome name="phone" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleMessageDriver}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  driverMarker: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    transform: [{ rotate: '90deg' }],
  },
  rideInfoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  carText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  locationInfo: {
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ECDC4',
    marginRight: 12,
  },
  locationDotEnd: {
    backgroundColor: '#EF4444',
  },
  locationText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  divider: {
    height: 20,
    width: 1,
    backgroundColor: '#D1D5DB',
    marginLeft: 4,
    marginRight: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
});