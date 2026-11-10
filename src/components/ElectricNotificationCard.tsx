import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

export interface InAppNotificationData {
  id: string;
  title: string;
  time: string;
  duration: string;
  taskTitle: string;
  dayNumber: number;
  type: string;
}

interface ElectricNotificationCardProps {
  notification: InAppNotificationData | null;
  onDismiss: () => void;
  onAction?: (notification: InAppNotificationData) => void;
}

export function ElectricNotificationCard({
  notification,
  onDismiss,
  onAction,
}: ElectricNotificationCardProps) {
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (notification) {
      // Slide down in-app banner
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 50,
      }).start();

      // Pulsing glow animation on electric dot
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.35,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <Animated.View
      style={[
        styles.overlayContainer,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.card}>
        {/* Electric Glow Top Accent Line */}
        <View style={styles.electricTopLine} />

        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.badgeRow}>
            <Animated.View
              style={[
                styles.electricDot,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <View style={styles.electricBadge}>
              <Text style={styles.electricBadgeText}>⚡ SESSION ALERT</Text>
            </View>
            <Text style={styles.dayText}>Day {notification.dayNumber}</Text>
          </View>

          <TouchableOpacity
            onPress={onDismiss}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={18} color="#00F5FF" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.timeRow}>
            <Ionicons name="time" size={14} color="#00F5FF" />
            <Text style={styles.timeText}>{notification.time}</Text>
            <View style={styles.durationPill}>
              <Text style={styles.durationPillText}>{notification.duration}</Text>
            </View>
          </View>

          <Text style={styles.sessionTitle}>{notification.title}</Text>
          <Text style={styles.taskTitle}>{notification.taskTitle}</Text>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => {
              if (onAction) onAction(notification);
              onDismiss();
            }}
          >
            <Ionicons name="flash" size={16} color="#05101A" />
            <Text style={styles.actionBtnText}>Start Session Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.snoozeBtn}
            activeOpacity={0.7}
            onPress={onDismiss}
          >
            <Text style={styles.snoozeBtnText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 28,
    left: 12,
    right: 12,
    zIndex: 9999,
    elevation: 20,
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
  },
  card: {
    backgroundColor: '#071018',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#00F5FF',
    padding: 16,
    overflow: 'hidden',
  },
  electricTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#00F5FF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  electricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00F5FF',
    shadowColor: '#00F5FF',
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  electricBadge: {
    backgroundColor: 'rgba(0, 245, 255, 0.18)',
    borderColor: '#00F5FF',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  electricBadgeText: {
    color: '#00F5FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  dayText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 245, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection: {
    marginBottom: 14,
    gap: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#00F5FF',
    letterSpacing: 0.3,
  },
  durationPill: {
    backgroundColor: '#122533',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7DD3FC',
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  taskTitle: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00F5FF',
    borderRadius: 12,
    paddingVertical: 11,
    gap: 6,
    shadowColor: '#00F5FF',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#05101A',
    letterSpacing: 0.2,
  },
  snoozeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#111D28',
    borderWidth: 1,
    borderColor: '#1E3547',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snoozeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
