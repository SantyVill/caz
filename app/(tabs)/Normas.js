import { ScrollView, Text } from "react-native";

import {Link} from "expo-router";

export default function Normas(){
    return <ScrollView className="p-4">
            <Text className="text-3xl font-bold mb-4">Normas de las canchas.</Text>
            <Text className="text-lg mb-2">1. La casa se reserva el derecho de admisión</Text>
            <Text className="text-lg mb-2">2. La casa no se responsabiliza por perdidas y hurtos</Text>
            <Text className="text-lg mb-2">3. En caso de llegaar tarde el turno comienza apartir de la hora reservada.</Text>
            <Text className="text-lg mb-2">4. No se permiten botines de f11.</Text>
            <Text className="text-lg mb-2">5. No se puede llevar bebidas al predio.</Text>
        </ScrollView>
}