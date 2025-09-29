import { View,Pressable,Text } from "react-native";
import { CustomButton } from "./CustomButton";
import {Link} from "expo-router";
import { EvilIcons } from "@expo/vector-icons";

export function Main() {
    return (
        <View className="flex-1 justify-center items-center bg-gray-100 p-4">
            <Link href="/about" className="mb-4"> Go to About Page</Link> 
            <CustomButton label="Cancha 1 - Futbol 8" color="bg-blue-500" />
            <CustomButton label="Cancha 2 - Futbol 8" color="bg-blue-500" />
            <CustomButton label="Cancha 3 - Futbol 9, 8, 5" color="bg-blue-500" />
            <Link asChild href="/Normas">
                <Pressable className="bg-green-500 px-4 py-2 rounded-lg mt-4">
                    <Text className="text-white font-bold">Normas de las canchas</Text>
                </Pressable>
            </Link>
            <CustomButton label="Última reserva realizada" color="bg-purple-500" />
        </View>
    );
}
