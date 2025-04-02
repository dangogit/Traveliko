import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, Modal, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, X, Home, Search, Calendar, MessageCircle, Heart, User, Plus } from 'lucide-react-native';
import colors from '@/constants/colors';

interface MenuButtonProps {
  color?: string;
}

export default function MenuButton({ color = colors.text }: MenuButtonProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  // טיפול בלחיצה על כפתור חזרה באנדרואיד
  React.useEffect(() => {
    const backAction = () => {
      if (menuVisible) {
        setMenuVisible(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [menuVisible]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const navigateTo = (path: string) => {
    setMenuVisible(false);
    router.push(path);
  };

  const תפריטפריטים = [
    { icon: <Home size={20} color={colors.primary} />, label: 'בית', path: '/' },
    { icon: <User size={20} color={colors.primary} />, label: 'פרופיל', path: '/profile' },
    { icon: <Search size={20} color={colors.primary} />, label: 'חיפוש', path: '/search' },
    { icon: <Calendar size={20} color={colors.primary} />, label: 'טיולים', path: '/trips' },
    { icon: <Plus size={20} color={colors.primary} />, label: 'טיול חדש', path: '/create-trip' },
    { icon: <Heart size={20} color={colors.primary} />, label: 'מועדפים', path: '/favorites' },
    { icon: <MessageCircle size={20} color={colors.primary} />, label: "צ'אט", path: '/chat' },
  ];

  return (
    <>
      <Pressable style={styles.button} onPress={toggleMenu} accessibilityLabel="תפריט">
        <Menu size={24} color={color} />
      </Pressable>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={toggleMenu}>
          <View style={styles.menuContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.menuHeader}>
              <Pressable onPress={toggleMenu} accessibilityLabel="סגור תפריט">
                <X size={24} color={colors.text} />
              </Pressable>
              <Text style={styles.menuTitle}>תפריט</Text>
            </View>

            <View style={styles.menuItems}>
              {תפריטפריטים.map((פריט, אינדקס) => (
                <Pressable
                  key={אינדקס}
                  style={styles.menuItem}
                  onPress={() => navigateTo(פריט.path)}
                  accessibilityLabel={פריט.label}
                >
                  <Text style={styles.menuItemText}>{פריט.label}</Text>
                  <View style={styles.iconContainer}>
                    {פריט.icon}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    zIndex: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  menuContainer: {
    width: '80%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1001,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
    flex: 1,
  },
  menuItems: {
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
    textAlign: 'right',
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});