import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import StudyCardsContext from '../contexts/StudyCardsContext'
import DateTimePickerModal from 'react-native-modal-datetime-picker'


const CardEditScreen = ({ route, navigation }) => {

    const { id } = route.params || {}
    const { cards, addCard, updateCard } = useContext(StudyCardsContext)
    const card = cards.find(c => c.id === id) || {}

    const [title, setTitle] = useState(card.title || '')
    const [notes, setNotes] = useState(card.notes || '')
    const [status, setStatus] = useState(card.status || 'fazer')
    const [dueDate, setDueDate] = useState(card.dueDate ? new Date(card.dueDate) : new Date())
    const [isDatePickerVisible, setDatePickerVisible] = useState(false)

    useEffect(() => {
      if (id) {
        setTitle(card.title)
        setStatus(card.status)
        setNotes(card.notes)
        setDueDate(new Date(card.dueDate))
      }
    }, [id, card])

    const handleSave = () => {
      const cardData = { title, notes, status, dueDate: dueDate.toISOString() }

      if (id) {
        updateCard(id, cardData)
      } else {
        addCard(cardData)
      }

      navigation.goBack()
    }

    const showDatePicker = () => {
      setDatePickerVisible(true)
    }

    const hideDatePicker = () => {
      setDatePickerVisible(false)
    }

    const handleConfirm = (date) => {
      setDueDate(date)
      hideDatePicker()
    }

    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
  };


  return (
    <View style={styles.container}>
            <Text style={styles.label}>Título:</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Título do Card..."
                placeholderTextColor="#C0C0C0"
            />
            <Text style={styles.label}>Notas:</Text>
            <TextInput
                style={styles.input}
                value={notes}
                onChangeText={setNotes}
                placeholder="Insira uma descrição..."
                multiline
                placeholderTextColor="#C0C0C0"
            />
            <Text style={styles.label}>Data/Hora de Término:</Text>
            <Button title="Escolhar Data" onPress={showDatePicker} color="#AF86C7" />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <Text style={styles.selectedDateLabel}>Data selecionada: {formatDate(dueDate)}</Text>

            <Text style={styles.label}>Status:</Text>
            <Picker
                selectedValue={status}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}>
                <Picker.Item label="A fazer" value="fazer" />
                <Picker.Item label="Fazendo" value="fazendo" />
                <Picker.Item label="Feito" value="feito" />
            </Picker>
            <Button title="Salvar" onPress={handleSave} color="#AF86C7" />
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#20232C',
  },
  label: {
      fontSize: 16,
      marginBottom: 5,
      color: "#fff"
  },
  selectedDateLabel: {
      fontSize: 16,
      marginBottom: 15,
      color: '#FF79C6',
  },
  input: {
      fontSize: 14,
      borderWidth: 1,
      borderColor: '#cccccc',
      padding: 10,
      marginBottom: 15,
      borderRadius: 5,
      width: '100%',      
      color:"#C0C0C0"

  }
});

export default CardEditScreen