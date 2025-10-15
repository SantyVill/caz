import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-6">Canchas</Text>

      <Link href="/cancha1" asChild>
        <Pressable className="bg-blue-500 px-6 py-3 rounded-lg mb-4">
          <Text className="text-white text-lg font-bold">Cancha 1 - Fútbol 8</Text>
        </Pressable>
      </Link>

      <Link href="/cancha2" asChild>
        <Pressable className="bg-blue-500 px-6 py-3 rounded-lg mb-4">
          <Text className="text-white text-lg font-bold">Cancha 2 - Fútbol 8</Text>
        </Pressable>
      </Link>

      <Link href="/cancha3" asChild>
        <Pressable className="bg-blue-500 px-6 py-3 rounded-lg mb-4">
          <Text className="text-white text-lg font-bold">Cancha 3 - Fútbol 9, 8, 5</Text>
        </Pressable>
      </Link>
    </View>
  );
}
