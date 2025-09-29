import { View, Text } from "react-native";

export default function Turnos() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold">Mis turnos</Text>
      <Text>No tenés reservas aún.</Text>
    </View>
  );
}
