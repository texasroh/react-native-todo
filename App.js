import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { theme } from "./colors";
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function App() {
    const inputRef = useRef();

    const [working, setWorking] = useState(true);
    const [toDos, setToDos] = useState({});
    const travel = () => setWorking(false);
    const work = () => setWorking(true);
    const saveToDos = async (toSave) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch (e) {
            console.log(e);
        }
    };
    const loadToDos = async () => {
        try {
            const s = await AsyncStorage.getItem(STORAGE_KEY);
            if (s) {
                setToDos(JSON.parse(s));
            }
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        loadToDos();
    }, []);
    const addToDo = (event) => {
        const text = event.nativeEvent.text;
        if (text === "") {
            return;
        }
        // const newToDos = Object.assign({}, toDos, {
        //     [Date.now()]: { text, work: working },
        // });
        const newToDos = {
            ...toDos,
            [Date.now()]: { text, work: working },
        };
        setToDos(newToDos);
        saveToDos(newToDos);
        inputRef.current.clear();
    };
    const deleteToDo = (key) => {
        Alert.alert(
            "Delete ToDo",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => {
                        const newToDos = { ...toDos };
                        delete newToDos[key];
                        setToDos(newToDos);
                        saveToDos(newToDos);
                    },
                    style: "destructive",
                },
            ],
            {
                cancelable: true,
            }
        );
        return;
    };
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: working ? theme.white : theme.gray,
                        }}
                    >
                        Work
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: !working ? theme.white : theme.gray,
                        }}
                    >
                        Travel
                    </Text>
                </TouchableOpacity>
            </View>
            <TextInput
                ref={inputRef}
                onSubmitEditing={addToDo}
                returnKeyType="Done"
                autoCapitalize="sentences"
                style={styles.input}
                placeholder={
                    working ? "Add a To Do" : "Where do you want to go?"
                }
            />
            <ScrollView>
                {Object.keys(toDos).map((key) =>
                    toDos[key].work === working ? (
                        <View style={styles.toDo} key={key}>
                            <Text style={styles.toDoText}>
                                {toDos[key].text}
                            </Text>
                            <TouchableOpacity onPress={() => deleteToDo(key)}>
                                <Text>
                                    <Fontisto
                                        name="trash"
                                        size={18}
                                        color={theme.gray}
                                    />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        paddingHorizontal: 20,
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 100,
    },
    btnText: {
        fontSize: 30,
        fontWeight: "600",
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginVertical: 20,
        fontsize: 18,
    },
    toDo: {
        backgroundColor: theme.toDoBg,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    toDoText: {
        color: theme.white,
        fontSize: 16,
        fontWeight: "500",
    },
});
