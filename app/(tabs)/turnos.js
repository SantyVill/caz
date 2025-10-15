import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const cargarTurnos = async () => {
      try {
        const data = await AsyncStorage.getItem("mis_turnos");
        if (data) {
          setTurnos(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error cargando turnos locales:", error);
      }
    };
    cargarTurnos();
  }, []);

  if (turnos.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-bold">Mis turnos</Text>
        <Text>No tenés reservas aún.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4 text-center">Mis Turnos</Text>
      {turnos.map((t, i) => (
        <View
          key={i}
          className="border border-gray-300 rounded-xl p-4 mb-3 bg-gray-50"
        >
          <Text className="text-lg font-semibold">🏟 {t.cancha}</Text>
          <Text>📅 Fecha: {t.fecha}</Text>
          <Text>⏰ Horario: {t.horario}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
