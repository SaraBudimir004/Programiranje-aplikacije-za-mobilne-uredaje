import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
      <LinearGradient
          colors={['#0B0F1A', '#111827', '#0F172A']}
          style={styles.container}
      >

        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.title}>Smart Budget</Text>
            <Text style={styles.subtitle}>Track your money like a pro 💰</Text>
          </View>

          {/* LOGOUT ICON */}
          <Pressable onPress={handleLogout} style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={22} color="white" />
          </Pressable>
        </View>

        {/* BALANCE CARD */}
        <View style={styles.mainCard}>
          <Text style={styles.cardLabel}>Total Balance</Text>
          <Text style={styles.balance}>$ 0.00</Text>
          <Text style={styles.smallText}>+0% this month</Text>
        </View>

        {/* STATS */}
        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Income</Text>
            <Text style={styles.income}>$0</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Expenses</Text>
            <Text style={styles.expense}>$0</Text>
          </View>
        </View>

        {/* QUICK ACTION */}
        <View style={styles.quickCard}>
          <Text style={{ color: '#94A3B8' }}>
            + Add your first transaction
          </Text>
        </View>

      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: '800',
  },

  subtitle: {
    color: '#94A3B8',
    marginTop: 4,
  },

  logoutIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainCard: {
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  balance: {
    color: 'white',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 10,
  },

  smallText: {
    color: '#10B981',
    marginTop: 6,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  card: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 16,
  },

  cardLabel: {
    color: '#94A3B8',
    marginBottom: 8,
  },

  income: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: '700',
  },

  expense: {
    color: '#EF4444',
    fontSize: 20,
    fontWeight: '700',
  },

  quickCard: {
    marginTop: 25,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
});