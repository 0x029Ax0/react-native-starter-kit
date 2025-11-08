import { Button } from "@/components/ui";
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs";
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = '@smoking_tracker_data';

const SmokingScreen = () => {

    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<number|null>(null);
    const [costPerDay, setCostPerDay] = useState<number>(15);
    const [daysWithoutNicotine, setDaysWithoutNicotine] = useState<number>(0);
    const [moneySaved, setMoneySaved] = useState<number>(0);

    // Load data from storage on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await AsyncStorage.getItem(STORAGE_KEY);
                if (data) {
                    const parsed = JSON.parse(data);
                    setIsRunning(parsed.isRunning ?? false);
                    setStartDate(parsed.startDate ?? null);
                    setCostPerDay(parsed.costPerDay ?? 15);
                }
            } catch (error) {
                console.error('Error loading smoking tracker data:', error);
            }
        };
        loadData();
    }, []);

    // Save data to storage when state changes
    useEffect(() => {
        const saveData = async () => {
            try {
                const data = {
                    isRunning,
                    startDate,
                    costPerDay,
                };
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (error) {
                console.error('Error saving smoking tracker data:', error);
            }
        };
        saveData();
    }, [isRunning, startDate, costPerDay]);

    // Calculate the amount of days without nicotine
    useEffect(() => {
        if (isRunning && startDate) {
            const now = dayjs();
            const start = dayjs.unix(startDate);
            const diff = now.diff(start, 'days');
            setDaysWithoutNicotine(diff);
        } else {
            setDaysWithoutNicotine(0);
        }
    }, [isRunning, startDate]);

    // Calculate the money saved
    useEffect(() => {
        if (isRunning) {
            setMoneySaved(costPerDay * daysWithoutNicotine);
        } else {
            setMoneySaved(0);
        }
    }, [isRunning, costPerDay, daysWithoutNicotine]);

    const handleStart = () => {
        const timestamp = dayjs().unix();
        setIsRunning(true);
        setStartDate(timestamp);
    };

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={{ marginBottom: 32, }}>
                        <Text style={styles.stat}>{daysWithoutNicotine}</Text>
                        <Text style={styles.statText}>Days without nicotine</Text>
                    </View>
                    <View>
                        <Text style={styles.secondaryStat}>€{moneySaved}</Text>
                        <Text style={styles.statText}>Money saved</Text>
                    </View>
                    <View>
                        <Text style={styles.text}></Text>
                        <Text style={styles.text}></Text>
                    </View>
                    {!isRunning && (
                        <View>
                            <Button
                                size="lg"
                                color="white"
                                label="Start the countdown"
                                onPress={handleStart}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SmokingScreen;

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    loadingText: {
        color: "#ffffff",
        fontSize: 16,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flex: 1,
        paddingBottom: 24,
        paddingHorizontal: 24,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
    },
    content: {
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
    },
    stat: {
        fontSize: 96,
        color: "#fff",
        textAlign: "center",
        fontFamily: "FiraCode",
    },
    secondaryStat: {
        fontSize: 64,
        color: "#fff",
        textAlign: "center",
        fontFamily: "FiraCode",
    },
    statText: {
        fontSize: 24,
        color: "#fff",
        textAlign: "center",
        fontFamily: "FiraCode",
    },
    text: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        fontFamily: "FiraCode",
    }
});