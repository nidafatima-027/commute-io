import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircle, Check, X, User, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { ridesAPI, usersAPI } from '../../services/api';
import webSocketService from '../../services/websocket-mock';

interface RideRequest {
  id: number;
  rider_id: number;
  ride_id: number;
  status: string;
  requested_at: string;
  message?: string;
  rider: {
    id: number;
    name: string;
    photo_url: string;
    rating?: number;
    rides_taken?: number;
  };
  ride: {
    id: number;
    start_location: string;
    end_location: string;
    start_time: string;
    seats_available: number;
    total_fare: number;
  };
}

export default function DriverRequestsScreen() {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingRequest, setProcessingRequest] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();

    // Set up WebSocket listeners for real-time updates
    const handleNewRequest = (data: any) => {
      console.log('New ride request received:', data);
      loadRequests(); // Refresh the list
    };

    webSocketService.onNewRideRequest(handleNewRequest);

    // Cleanup on unmount
    return () => {
      webSocketService.off('new_ride_request', handleNewRequest);
    };
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      // Get all pending requests for the driver's rides
      const data = await ridesAPI.getDriverRideRequests();
      setRequests(data.filter((req: RideRequest) => req.status === 'pending'));
    } catch (error) {
      console.error('Error loading requests:', error);
      Alert.alert('Error', 'Failed to load ride requests');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const handleAcceptRequest = async (requestId: number) => {
    setProcessingRequest(requestId);
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      await ridesAPI.updateRideRequest(requestId, 'accepted');
      
      // Navigate to ride confirmation screen
      router.push({
        pathname: '/(tabs)/ride-confirmed',
        params: {
          driverName: 'You', // Current user is the driver
          riderName: request.rider.name,
          riderImage: request.rider.photo_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          startLocation: request.ride.start_location,
          endLocation: request.ride.end_location,
          startTime: request.ride.start_time,
          totalFare: request.ride.total_fare,
          userRole: 'driver',
        },
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    setProcessingRequest(requestId);
    try {
      await ridesAPI.updateRideRequest(requestId, 'rejected');
      Alert.alert('Request Rejected', 'The ride request has been rejected.');
      loadRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Error', 'Failed to reject request');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleMessageRider = (request: RideRequest) => {
    router.push({
      pathname: '/(tabs)/message_inbox',
      params: {
        userId: request.rider.id,
        name: request.rider.name,
        image: request.rider.photo_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        rideId: request.ride_id,
        rideRoute: `${request.ride.start_location} to ${request.ride.end_location}`,
      },
    });
  };

  const handleViewProfile = (riderId: number) => {
    // Navigate to rider profile (to be implemented)
    Alert.alert('View Profile', 'Rider profile viewing will be implemented soon');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderRequest = (request: RideRequest) => (
    <View key={request.id} style={styles.requestCard}>
      {/* Rider Info */}
      <View style={styles.riderSection}>
        <TouchableOpacity
          style={styles.riderInfo}
          onPress={() => handleViewProfile(request.rider_id)}
        >
          <Image
            source={{ uri: request.rider.photo_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            style={styles.riderAvatar}
          />
          <View style={styles.riderDetails}>
            <Text style={styles.riderName}>{request.rider.name}</Text>
            <View style={styles.riderStats}>
              {request.rider.rating && (
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{request.rider.rating}</Text>
                </View>
              )}
              <Text style={styles.ridesCount}>
                {request.rider.rides_taken || 0} rides
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => handleMessageRider(request)}
        >
          <MessageCircle size={20} color="#4ECDC4" />
        </TouchableOpacity>
      </View>

      {/* Ride Info */}
      <View style={styles.rideSection}>
        <Text style={styles.routeText}>
          {request.ride.start_location} → {request.ride.end_location}
        </Text>
        <Text style={styles.rideTime}>
          {formatDateTime(request.ride.start_time)}
        </Text>
        <Text style={styles.fareText}>
          ${request.ride.total_fare} • {request.ride.seats_available} seats available
        </Text>
      </View>

      {/* Request Info */}
      <View style={styles.requestSection}>
        <Text style={styles.requestTime}>
          Requested {formatDateTime(request.requested_at)}
        </Text>
        {request.message && (
          <Text style={styles.requestMessage}>"{request.message}"</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.rejectButton,
            processingRequest === request.id && styles.disabledButton,
          ]}
          onPress={() => handleRejectRequest(request.id)}
          disabled={processingRequest === request.id}
        >
          {processingRequest === request.id ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <X size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Reject</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.acceptButton,
            processingRequest === request.id && styles.disabledButton,
          ]}
          onPress={() => handleAcceptRequest(request.id)}
          disabled={processingRequest === request.id}
        >
          {processingRequest === request.id ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Check size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Accept</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#2d3748" />
        </TouchableOpacity>
        <Text style={styles.title}>Ride Requests</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ECDC4" />
            <Text style={styles.loadingText}>Loading requests...</Text>
          </View>
        ) : requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Pending Requests</Text>
            <Text style={styles.emptyStateText}>
              You'll see ride requests from riders here when they request to join your rides.
            </Text>
          </View>
        ) : (
          requests.map(renderRequest)
        )}
      </ScrollView>
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
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  riderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  riderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  riderDetails: {
    flex: 1,
  },
  riderName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  riderStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
    marginLeft: 4,
  },
  ridesCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rideSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  routeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  rideTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  fareText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  requestSection: {
    marginBottom: 16,
  },
  requestTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  requestMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#4ECDC4',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});