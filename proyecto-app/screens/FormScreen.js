import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Platform,
  Modal
} from 'react-native';

// Componente de calendario personalizado que funciona en web y móvil
const CustomCalendar = ({ visible, onClose, onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const handleDatePress = (date) => {
    if (date) {
      onDateSelect(date);
      onClose();
    }
  };
  
  const days = getDaysInMonth(currentMonth);
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={calendarStyles.overlay}>
        <View style={calendarStyles.container}>
          <View style={calendarStyles.header}>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Text style={calendarStyles.navButton}>‹</Text>
            </TouchableOpacity>
            <Text style={calendarStyles.monthYear}>
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={goToNextMonth}>
              <Text style={calendarStyles.navButton}>›</Text>
            </TouchableOpacity>
          </View>
          
          <View style={calendarStyles.daysOfWeekContainer}>
            {daysOfWeek.map((day, index) => (
              <Text key={index} style={calendarStyles.dayOfWeek}>
                {day}
              </Text>
            ))}
          </View>
          
          <View style={calendarStyles.daysContainer}>
            {days.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  calendarStyles.dayButton,
                  isToday(date) && calendarStyles.today,
                  isSelected(date) && calendarStyles.selected
                ]}
                onPress={() => handleDatePress(date)}
                disabled={!date}
              >
                <Text style={[
                  calendarStyles.dayText,
                  isToday(date) && calendarStyles.todayText,
                  isSelected(date) && calendarStyles.selectedText,
                  !date && calendarStyles.emptyDay
                ]}>
                  {date ? date.getDate() : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={calendarStyles.buttonContainer}>
            <TouchableOpacity
              style={calendarStyles.cancelButton}
              onPress={onClose}
            >
              <Text style={calendarStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const calendarStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    maxWidth: 350,
    width: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    paddingHorizontal: 15,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayOfWeek: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
    fontSize: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  today: {
    backgroundColor: '#e3f2fd',
  },
  todayText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyDay: {
    color: 'transparent',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default function FormScreen({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    usuario: '',
    fecha: '',
    codigo: '',
    empleado: '',
    estado: '',
    turno: ''
  });
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleDateSelect = (date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(date);
    handleInputChange('fecha', formattedDate);
  };
  
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = () => {
    // Validar que al menos algunos campos estén llenos
    if (!formData.usuario.trim()) {
      Alert.alert('Error', 'Por favor completa el campo Usuario');
      return;
    }
    if (!formData.fecha.trim()) {
      Alert.alert('Error', 'Por favor completa el campo Fecha');
      return;
    }
    
    console.log('Formulario válido, navegando a DocumentScreen');
    onNext();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Formulario</Text>
      </View>

      <View style={styles.form}>
        {/* Usuario */}
        <View style={styles.row}>
          <Text style={styles.label}>USUARIO:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputLarge]}
              placeholder="LABEL"
              value={formData.usuario}
              onChangeText={(text) => handleInputChange('usuario', text)}
            />
            <TouchableOpacity style={styles.smallButton}>
              <Text style={styles.buttonText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fecha con calendario */}
        <View style={styles.row}>
          <Text style={styles.label}>FECHA:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputLarge]}
              placeholder="DD/MM/YYYY"
              value={formData.fecha}
              onChangeText={(text) => handleInputChange('fecha', text)}
            />
            <TouchableOpacity 
              style={styles.smallButton}
              onPress={() => setShowCalendar(true)}
            >
              <Text style={styles.buttonText}>📅</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>💾</Text>
          </TouchableOpacity>
        </View>

        {/* Tablas de datos */}
        <View style={styles.tablesContainer}>
          <View style={styles.tableLeft}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Empleado</Text>
            </View>
            <TextInput
              style={styles.tableInput}
              placeholder="Empleado"
              value={formData.empleado}
              onChangeText={(text) => handleInputChange('empleado', text)}
            />
            <TextInput
              style={styles.tableInput}
              placeholder="Código"
              value={formData.codigo}
              onChangeText={(text) => handleInputChange('codigo', text)}
            />
            <TextInput
              style={styles.tableInput}
              placeholder="Estado"
              value={formData.estado}
              onChangeText={(text) => handleInputChange('estado', text)}
            />
            <TextInput
              style={styles.tableInput}
              placeholder="Turno"
              value={formData.turno}
              onChangeText={(text) => handleInputChange('turno', text)}
            />
          </View>

          <View style={styles.tableRight}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Información</Text>
            </View>
            <TextInput style={styles.tableInput} placeholder="Campo 1" />
            <TextInput style={styles.tableInput} placeholder="Campo 2" />
            <TextInput style={styles.tableInput} placeholder="Campo 3" />
            <TextInput style={styles.tableInput} placeholder="Campo 4" />
          </View>
        </View>

        {/* Área de resultados */}
        <View style={styles.resultsArea}>
          <Text style={styles.resultsTitle}>Resultados:</Text>
          <ScrollView style={styles.resultsScroll}>
            <Text style={styles.resultsText}>
              Usuario: {formData.usuario}{'\n'}
              Fecha: {formData.fecha}{'\n'}
              Empleado: {formData.empleado}{'\n'}
              Código: {formData.codigo}{'\n'}
              Estado: {formData.estado}{'\n'}
              Turno: {formData.turno}
            </Text>
          </ScrollView>
        </View>

        {/* Botón continuar */}
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            (!formData.usuario.trim() || !formData.fecha.trim()) && styles.continueButtonDisabled
          ]} 
          onPress={handleSubmit}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>

        {/* Indicador de validación */}
        {(!formData.usuario.trim() || !formData.fecha.trim()) && (
          <Text style={styles.validationText}>
            * Completa Usuario y Fecha para continuar
          </Text>
        )}
      </View>
      
      {/* Calendario Modal */}
      <CustomCalendar
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />
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
    color: '#333',
  },
  form: {
    padding: 20,
  },
  row: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
    fontSize: 16,
  },
  inputLarge: {
    flex: 1,
    marginRight: 10,
  },
  smallButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    minWidth: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
  },
  tablesContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  tableLeft: {
    flex: 1,
    marginRight: 10,
  },
  tableRight: {
    flex: 1,
    marginLeft: 10,
  },
  tableHeader: {
    backgroundColor: '#4a5568',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  tableHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3,
    padding: 8,
    backgroundColor: 'white',
    marginBottom: 3,
    fontSize: 14,
  },
  resultsArea: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultsScroll: {
    maxHeight: 150,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  validationText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});