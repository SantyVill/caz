import { View, Text } from "react-native";

export function Horario({ hora, disponible }) {
    return (
        <View
            className={`p-4 mb-2 rounded-lg ${disponible ? "bg-green-500" : "bg-red-500"
                }`}
        >
            <Text className="text-white text-lg font-bold">{hora}</Text>
        </View>
    );
}