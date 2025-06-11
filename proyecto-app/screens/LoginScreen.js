import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Platform,
  Easing
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Componente de Notificación Personalizada
const CustomNotification = ({ visible, message, type = 'error', onHide }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animación de entrada
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 500,
          easing: Easing.out(Easing.back(1.7)),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-ocultar después de 3 segundos
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  const getNotificationStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#4CAF50', icon: '✓' };
      case 'warning':
        return { backgroundColor: '#FF9800', icon: '⚠' };
      default:
        return { backgroundColor: '#F44336', icon: '✕' };
    }
  };

  const notificationStyle = getNotificationStyle();

  return (
    <Animated.View
      style={[
        styles.notification,
        {
          backgroundColor: notificationStyle.backgroundColor,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.notificationIcon}>{notificationStyle.icon}</Text>
      <Text style={styles.notificationText}>{message}</Text>
      <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function LoginScreen({ onNext }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'error' });

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const loadingRotateAnim = useRef(new Animated.Value(0)).current;
  const inputFocusAnim1 = useRef(new Animated.Value(0)).current;
  const inputFocusAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const showNotification = (message, type = 'error') => {
    setNotification({ visible: true, message, type });
  };

  const hideNotification = () => {
    setNotification({ visible: false, message: '', type: 'error' });
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startLoadingAnimation = () => {
    Animated.loop(
      Animated.timing(loadingRotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopLoadingAnimation = () => {
    loadingRotateAnim.stopAnimation();
    loadingRotateAnim.setValue(0);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showNotification('Por favor ingresa usuario y contraseña', 'error');
      return;
    }

    animateButton();
    setIsLoading(true);
    startLoadingAnimation();

    // Simular proceso de login
    setTimeout(() => {
      if (username.toLowerCase() === 'admin' && password === '123') {
        showNotification('¡Login exitoso!', 'success');
        setTimeout(() => {
          stopLoadingAnimation();
          setIsLoading(false);
          onNext && onNext();
        }, 1500);
      } else {
        showNotification('Usuario o contraseña incorrectos', 'error');
        stopLoadingAnimation();
        setIsLoading(false);
      }
    }, 2000);
  };

  const handleInputFocus = (inputNumber) => {
    const anim = inputNumber === 1 ? inputFocusAnim1 : inputFocusAnim2;
    Animated.timing(anim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputBlur = (inputNumber) => {
    const anim = inputNumber === 1 ? inputFocusAnim1 : inputFocusAnim2;
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const spin = loadingRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const inputBorderColor1 = inputFocusAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ddd', '#007AFF'],
  });

  const inputBorderColor2 = inputFocusAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ddd', '#007AFF'],
  });

  return (
    <View style={styles.container}>
      <CustomNotification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onHide={hideNotification}
      />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ],
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.title,
            {
              transform: [{
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                })
              }]
            }
          ]}
        >
          LOGIN
        </Animated.Text>
        
        <Animated.View
          style={[
            styles.inputContainer,
            { borderColor: inputBorderColor1 }
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            onFocus={() => handleInputFocus(1)}
            onBlur={() => handleInputBlur(1)}
            autoCapitalize="none"
            editable={!isLoading}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.inputContainer,
            { borderColor: inputBorderColor2 }
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            onFocus={() => handleInputFocus(2)}
            onBlur={() => handleInputBlur(2)}
            secureTextEntry
            editable={!isLoading}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: buttonScaleAnim }] }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonLoading
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Animated.Text
                  style={[
                    styles.loadingSpinner,
                    { transform: [{ rotate: spin }] }
                  ]}
                >
                  ⟳
                </Animated.Text>
                <Text style={styles.loginButtonText}>Ingresando...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Ingresar</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text
          style={[
            styles.demoText,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.7],
              })
            }
          ]}
        >
          Demo: admin / 123
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 2,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  input: {
    padding: 18,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 15px rgba(0, 122, 255, 0.3)',
      },
    }),
  },
  loginButtonLoading: {
    backgroundColor: '#5A9FFF',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    fontSize: 20,
    color: 'white',
    marginRight: 10,
  },
  demoText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  // Estilos para notificaciones
  notification: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
      },
    }),
  },
  notificationIcon: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});