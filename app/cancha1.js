import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


const API_URL =
  "https://script.google.com/macros/s/AKfycbybnLvbSXpUeOdT7litrDLBEPtiC9vb3D0PWObbMG6UkTgYO4doqv7rX4hP21L2WrPw/exec";

export default function CanchaHorarios() {
  // Generar los próximos 7 días
  const dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    return {
      id: i,
      label: fecha.toLocaleDateString("es-AR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      date: fecha,
    };
  });

  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [turnosReservados, setTurnosReservados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refresh, setRefresh] = useState(false);


  // Horarios fijos base (17:00 a 01:00)
  const horarios = Array.from({ length: 8 }, (_, i) => {
    const start = 17 + i;
    const end = (start + 1) % 24;
    return {
      id: i,
      label: `${String(start % 24).padStart(2, "0")}:00 - ${String(end).padStart(
        2,
        "0"
      )}:00`,
    };
  });

  // 🔹 Obtener turnos desde Google Sheets
  useEffect(() => {
    const fetchTurnos = async () => {
      setLoading(true);
      try {
        const fecha = formatFecha(diaSeleccionado);
        const res = await fetch(`${API_URL}?accion=mostrarTurnos&fecha=${fecha}`);
        const data = await res.json();
        setTurnosReservados(data);
      } catch (err) {
        console.error("Error cargando turnos:", err);
        Alert.alert("Error", "No se pudieron cargar los turnos.");
      } finally {
        setLoading(false);
      }
    };
    fetchTurnos();
  }, [diaSeleccionado,refresh]);

  // Formato de fecha para comparar con Google Sheets (dd-mm-yy)
  const formatFecha = (date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = String(date.getFullYear()).slice(-2);
    return `${d}-${m}-${y}`;
  };

  formatFecha(diaSeleccionado)


  // 🔹 Función para reservar turno (CORREGIDA)
const handleReservar = async () => {
    // Validar selección de horario
    if (!horarioSeleccionado) {
      Alert.alert("Atención", "Por favor, selecciona un horario antes de continuar.");
      return;
    }
    // Validar Nombre y Teléfono
    if (!nombre.trim() || !telefono.trim()) {
      Alert.alert("Atención", "Debes ingresar tu Nombre y Teléfono válidos para reservar.");
      return;
    }
    
    // 1. Definición de variables locales
    const horario = horarioSeleccionado.label;
    const fecha = formatFecha(diaSeleccionado);
 // Ejemplo: 07-10-25
    console.log("Horario seleccionado:"); // Depuración
    const cancha = "9";
    
    // 🚨 CORRECCIÓN: Imprimir las variables locales que se enviarán
    console.log("--- Datos a enviar al servidor (POST) ---");
    console.log("Horario:", horario);
    console.log("Fecha:", fecha);
    console.log("Nombre:", nombre.trim());
    console.log("Teléfono:", telefono.trim());
    console.log("Cancha:", cancha);
    console.log("---------------------------------------");

    // 2. Preparación de los datos (sin cambios)
    const data = new URLSearchParams();
    data.append("horario", horario);
    data.append("fecha", fecha);
    data.append("cancha", cancha);
    data.append("nombre", nombre.trim());
    data.append("telefono", telefono.trim());

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString(), 
        });
        
        const text = await res.text();
        
        // 🚨 Añadir depuración de la respuesta del servidor aquí:
        console.log("Respuesta del servidor GAS:", text);

        // ... el resto de tu lógica de manejo de respuesta ...
        if (text.includes("Turno reservado")) {
            Alert.alert("¡Reserva Exitosa! 🎉", "Tu turno ha sido reservado.");
            setNombre("");
            setTelefono("");
            setHorarioSeleccionado(null);
            setTurnosReservados(prev => [...prev, { horario: horario, fecha: fecha }]);
            const nuevoTurno = {
              cancha : "Cancha 1",
              horario,
              fecha,
              nombre: nombre.trim(),
              telefono: telefono.trim(),
              timestamp: Date.now()
            };

            try {
              const existentes = await AsyncStorage.getItem("mis_turnos");
              const turnosPrevios = existentes ? JSON.parse(existentes) : [];

              // Guardar solo el último turno por cancha
              const actualizados = [
                ...turnosPrevios.filter(t => t.cancha !== cancha),
                nuevoTurno
              ];

              await AsyncStorage.setItem("mis_turnos", JSON.stringify(actualizados));
              console.log("✅ Turno guardado localmente:", actualizados);
            } catch (error) {
              console.error("Error guardando turno local:", error);
            }
            setRefresh(!refresh);
        } else {
            Alert.alert("Error de Reserva", `El servidor respondió: ${text}`);
        }
    } catch (err) {
        console.error("Error al reservar turno:", err);
        Alert.alert("Error de Conexión", "No se pudo comunicar con el servidor de reservas.");
    }
  };  
  const onChangeDate = (event, date) => {
    setShowPicker(false);
    if (date) {
      setDiaSeleccionado(date);
      setSelectedDate(date);
    }
  };



  return (
  <ScrollView className="flex-1 bg-white p-4 mt-5">
    {/* Encabezado con flechas (lo que ya tenías) */}
    <View className="flex-row items-center justify-between mb-4">
      <Pressable
  disabled={diaSeleccionado <= new Date()} // Deshabilita si la fecha es hoy o anterior
  onPress={() => {
    const prev = new Date(diaSeleccionado);
    prev.setDate(prev.getDate() - 1);
    setDiaSeleccionado(prev);
  }}
>
  <AntDesign
    name="left"
    size={24}
    color={diaSeleccionado <= new Date() ? "gray" : "black"}
  />
</Pressable>

<Pressable onPress={() => setShowPicker(true)}>
  <Text className="text-xl font-semibold text-center">
    {formatFecha(diaSeleccionado)}
  </Text>
</Pressable>

<Pressable
  onPress={() => {
    const next = new Date(diaSeleccionado);
    next.setDate(next.getDate() + 1);
    setDiaSeleccionado(next);
  }}
>
  <AntDesign name="right" size={24} color="black" />
</Pressable>

      {showPicker && (
    <DateTimePicker
      value={selectedDate}
      mode="date"
      display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
      minimumDate={new Date()} // 🔒 no permite fechas anteriores al día actual
      onChange={onChangeDate}
    />
  )}
      
    </View>

    {/* Grilla: solo los horarios fijos (2 columnas x 4 filas) */}
    {/* Mostrar mensaje de carga */}
    {loading ? (
      <View className="py-10">
        <Text className="text-center text-gray-500 text-lg">Cargando turnos...</Text>
      </View>
    ) : (
      <View className="flex-row flex-wrap justify-between">
        {horarios.map((h) => {
          const ocupado = turnosReservados.some(
            (t) =>
              (t.horario || "").trim() === h.label.trim() &&
              (t.estado || "").trim() === "Ocupado"
          );

          return (
            <Pressable
              key={h.id}
              disabled={ocupado}
              onPress={() => setHorarioSeleccionado(h)}
              className={`w-[48%] p-3 rounded-xl mb-3 ${
                ocupado ? "bg-red-400" : "bg-green-400"
              }`}
            >
              <Text className="text-white font-bold text-center">{h.label}</Text>
            </Pressable>
          );
        })}
      </View>
    )}
    {/* Formulario de reserva (sin cambios) */}
    {horarioSeleccionado && !loading && (
        <View className="mt-6 p-4 rounded-xl border border-gray-300 bg-gray-50">
          <Text className="text-lg font-bold mb-2">Reserva seleccionada:</Text>
          <Text className="mb-2">
            📅 {formatFecha(diaSeleccionado)} - ⏰ {horarioSeleccionado.label}
          </Text>

          <TextInput
            placeholder="Nombre y Apellido"
            value={nombre}
            onChangeText={setNombre}
            className="border border-gray-300 rounded-lg p-2 mb-3"
          />

          <TextInput
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            className="border border-gray-300 rounded-lg p-2 mb-3"
          />

          <Pressable className="bg-blue-500 p-3 rounded-lg mb-3">
            <Text className="text-white text-center font-bold">
              Pagar reserva de turno
            </Text>
          </Pressable>
          <Pressable onPress={handleReservar} className="bg-green-500 p-3 rounded-lg">
            <Text className="text-white text-center font-bold">Reservar</Text>
          </Pressable>
        </View>
      )}
      {!horarioSeleccionado && !loading && (
        <View className="mt-6 p-4 rounded-xl border border-gray-300 bg-gray-50">
          {/* centrar texto */}
          <Text className="text-lg font-bold mb-2 text-center">Seleccione fecha y horario.</Text>
          
        </View>
      )}

  </ScrollView>
);

}
