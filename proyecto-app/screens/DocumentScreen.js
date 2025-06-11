import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Platform,
  PanResponder,
  Dimensions
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function DocumentScreen({ onBack }) {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSignatureConfirmed, setIsSignatureConfirmed] = useState(false);
  const [tempPaths, setTempPaths] = useState([]);
  const [lastInteractionTime, setLastInteractionTime] = useState(0);
  const pathRef = useRef('');
  const signatureAreaRef = useRef(null);
  const confirmationTimeoutRef = useRef(null);

  // PanResponder mejorado para manejar los gestos de firma
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      setIsDrawing(true);
      const { locationX, locationY } = evt.nativeEvent;
      
      // Asegurar que las coordenadas estén dentro del área de firma
      const x = Math.max(0, Math.min(locationX, width - 80));
      const y = Math.max(0, Math.min(locationY, 200));
      
      const newPath = `M${x.toFixed(2)},${y.toFixed(2)}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    },

    onPanResponderMove: (evt) => {
      if (!isDrawing) return;
      
      const { locationX, locationY } = evt.nativeEvent;
      
      // Asegurar que las coordenadas estén dentro del área de firma
      const x = Math.max(0, Math.min(locationX, width - 80));
      const y = Math.max(0, Math.min(locationY, 200));
      
      const newPath = pathRef.current + ` L${x.toFixed(2)},${y.toFixed(2)}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    },

    onPanResponderRelease: () => {
      if (pathRef.current && isDrawing) {
        setTempPaths(prevPaths => [...prevPaths, pathRef.current]);
        setCurrentPath('');
        pathRef.current = '';
        
        // Actualizar tiempo de última interacción
        setLastInteractionTime(Date.now());
        
        // Limpiar timeout anterior
        if (confirmationTimeoutRef.current) {
          clearTimeout(confirmationTimeoutRef.current);
        }
        
        // Mostrar confirmación después de 1.5 segundos sin actividad
        confirmationTimeoutRef.current = setTimeout(() => {
          setShowConfirmation(true);
        }, 1500);
      }
      setIsDrawing(false);
    },

    onPanResponderTerminate: () => {
      if (pathRef.current && isDrawing) {
        setTempPaths(prevPaths => [...prevPaths, pathRef.current]);
        setCurrentPath('');
        pathRef.current = '';
        
        // Actualizar tiempo de última interacción
        setLastInteractionTime(Date.now());
        
        // Limpiar timeout anterior
        if (confirmationTimeoutRef.current) {
          clearTimeout(confirmationTimeoutRef.current);
        }
        
        // Mostrar confirmación después de 1.5 segundos sin actividad
        confirmationTimeoutRef.current = setTimeout(() => {
          setShowConfirmation(true);
        }, 1500);
      }
      setIsDrawing(false);
    },
  });

  const clearSignature = () => {
    // Limpiar timeout
    if (confirmationTimeoutRef.current) {
      clearTimeout(confirmationTimeoutRef.current);
    }
    
    setPaths([]);
    setTempPaths([]);
    setCurrentPath('');
    pathRef.current = '';
    setIsDrawing(false);
    setIsSignatureConfirmed(false);
    setShowConfirmation(false);
    setLastInteractionTime(0);
  };

  const confirmSignature = () => {
    // Limpiar timeout
    if (confirmationTimeoutRef.current) {
      clearTimeout(confirmationTimeoutRef.current);
    }
    
    setPaths([...paths, ...tempPaths]);
    setTempPaths([]);
    setIsSignatureConfirmed(true);
    setShowConfirmation(false);
  };

  const cancelSignature = () => {
    // Limpiar timeout
    if (confirmationTimeoutRef.current) {
      clearTimeout(confirmationTimeoutRef.current);
    }
    
    setTempPaths([]);
    setCurrentPath('');
    pathRef.current = '';
    setShowConfirmation(false);
  };

  const hasSignature = () => {
    return paths.length > 0 || tempPaths.length > 0 || currentPath.length > 0;
  };

  const hasConfirmedSignature = () => {
    return paths.length > 0 && isSignatureConfirmed;
  };

  // Limpiar timeout al desmontar el componente
  React.useEffect(() => {
    return () => {
      if (confirmationTimeoutRef.current) {
        clearTimeout(confirmationTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    if (!hasConfirmedSignature()) {
      Alert.alert('Error', 'Por favor firme y confirme el documento antes de enviar');
      return;
    }
    Alert.alert('Éxito', 'Documento enviado correctamente', [
      { text: 'OK', onPress: onBack }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ARIS</Text>
      </View>

      <View style={styles.document}>
        <Text style={styles.documentTitle}>FORMATO DE ENTREGA Y DEVOLUCIÓN DE BIENES</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>DATOS DE USUARIO</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NOMBRE:</Text>
            <Text style={styles.infoValue}>JUAN PÉREZ</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CARGO:</Text>
            <Text style={styles.infoValue}>DESARROLLADOR SENIOR</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CÓDIGO:</Text>
            <Text style={styles.infoValue}>EMP-2024-001</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>USUARIO:</Text>
            <Text style={styles.infoValue}>jperez</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>FECHA:</Text>
            <Text style={styles.infoValue}>10/06/2025</Text>
          </View>
        </View>

        <View style={styles.table}>
          <Text style={styles.tableTitle}>ASIGNACIÓN ACTUAL</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>ITEM</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>DESCRIPCIÓN</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>CANTIDAD</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>ESTADO</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>001</Text>
            <Text style={styles.tableCell}>Laptop HP</Text>
            <Text style={styles.tableCell}>1</Text>
            <Text style={styles.tableCell}>Bueno</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>002</Text>
            <Text style={styles.tableCell}>Mouse Óptico</Text>
            <Text style={styles.tableCell}>1</Text>
            <Text style={styles.tableCell}>Bueno</Text>
          </View>
        </View>

        <View style={styles.table}>
          <Text style={styles.tableTitle}>REGISTRO HISTÓRICO DE DEVOLUCIONES</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>FECHA</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>ITEM</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>ESTADO</Text>
          </View>
        </View>

        <View style={styles.table}>
          <Text style={styles.tableTitle}>OBSERVACIONES DE ASIGNACIÓN ACTUAL</Text>
          <View style={styles.observationsBox}>
            <Text style={styles.observationsText}>
              Equipo asignado en perfecto estado. Responsabilidad del usuario mantener en buen estado.
            </Text>
          </View>
        </View>

        {/* Área de firma mejorada */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureTitle}>FIRMA</Text>
          <View style={styles.signatureContainer}>
            <View 
              ref={signatureAreaRef}
              style={[
                styles.signatureArea,
                hasConfirmedSignature() && styles.signatureAreaConfirmed,
                (showConfirmation || tempPaths.length > 0) && !isSignatureConfirmed && styles.signatureAreaPending
              ]}
              {...(!showConfirmation ? panResponder.panHandlers : {})}
            >
              <Svg 
                height="200" 
                width={width - 80} 
                style={styles.svg}
                viewBox={`0 0 ${width - 80} 200`}
              >
                {/* Firma confirmada */}
                {paths.map((path, index) => (
                  <Path
                    key={`confirmed-${index}`}
                    d={path}
                    stroke="#000"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                
                {/* Firma temporal (pendiente de confirmación) */}
                {tempPaths.map((path, index) => (
                  <Path
                    key={`temp-${index}`}
                    d={path}
                    stroke="#007AFF"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                ))}
                
                {/* Trazo actual */}
                {currentPath && (
                  <Path
                    d={currentPath}
                    stroke="#007AFF"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                )}
              </Svg>
              
              {!hasSignature() && !showConfirmation && (
                <View style={styles.signaturePlaceholderContainer}>
                  <Text style={styles.signaturePlaceholder}>
                    {Platform.OS === 'web' ? 'Haz clic y arrastra para firmar' : 'Toca y arrastra para firmar'}
                  </Text>
                </View>
              )}
              
              {showConfirmation && (
                <View style={styles.signaturePlaceholderContainer}>
                  <Text style={styles.signatureConfirmationText}>
                    ¿Confirmas tu firma?
                  </Text>
                </View>
              )}
              
              {hasConfirmedSignature() && (
                <View style={styles.signatureStatusContainer}>
                  <Text style={styles.signatureConfirmedText}>✓ Firma Confirmada</Text>
                </View>
              )}
            </View>
            
            <View style={styles.buttonContainer}>
              {showConfirmation && (
                <View style={styles.confirmationButtons}>
                  <TouchableOpacity 
                    style={styles.confirmButton} 
                    onPress={confirmSignature}
                  >
                    <Text style={styles.confirmButtonText}>✓ Confirmar Firma</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={cancelSignature}
                  >
                    <Text style={styles.cancelButtonText}>✗ Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <TouchableOpacity 
                style={[styles.clearButton, !hasSignature() && styles.buttonDisabled]} 
                onPress={clearSignature}
                disabled={!hasSignature()}
              >
                <Text style={[styles.clearButtonText, !hasSignature() && styles.buttonTextDisabled]}>
                  Limpiar Todo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Botón enviar */}
        <TouchableOpacity 
          style={[styles.sendButton, !hasConfirmedSignature() && styles.sendButtonDisabled]} 
          onPress={handleSend}
          disabled={!hasConfirmedSignature()}
        >
          <Text style={[styles.sendButtonText, !hasConfirmedSignature() && styles.sendButtonTextDisabled]}>
            ENVIAR DOCUMENTO
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  document: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 80,
    color: '#333',
  },
  infoValue: {
    flex: 1,
    color: '#666',
  },
  table: {
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#2E8B57',
    color: 'white',
    padding: 8,
    textAlign: 'center',
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a5568',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  tableCellHeader: {
    color: 'white',
    fontWeight: 'bold',
  },
  observationsBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    minHeight: 60,
    backgroundColor: '#f9f9f9',
  },
  observationsText: {
    fontSize: 14,
    color: '#666',
  },
  signatureSection: {
    marginBottom: 20,
  },
  signatureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  signatureContainer: {
    alignItems: 'center',
  },
  signatureArea: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    width: width - 80,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  signatureAreaWithContent: {
    backgroundColor: '#ffffff',
    borderColor: '#2E8B57',
  },
  signatureAreaConfirmed: {
    backgroundColor: '#ffffff',
    borderColor: '#2E8B57',
    borderWidth: 3,
  },
  signatureAreaPending: {
    backgroundColor: '#f8f9ff',
    borderColor: '#007AFF',
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  signaturePlaceholderContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  signaturePlaceholder: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  signatureStatusContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2E8B57',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  signatureConfirmedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  signatureConfirmationText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  confirmButton: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonTextDisabled: {
    color: '#666666',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonTextDisabled: {
    color: '#666666',
  },
});