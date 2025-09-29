import { Pressable, Text } from "react-native";

export function CustomButton({ label, onPress, color = "bg-blue-500" }) {
    return (
        <Pressable
            onPress={onPress}
            className={`w-64 ${color} rounded-xl p-4 mb-4`}
        >
            <Text className="text-white text-lg font-bold text-center">
                {label}
            </Text>
        </Pressable>
    );
}