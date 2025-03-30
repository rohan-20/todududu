import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated, ImageBackground, SafeAreaView} from "react-native";
import { supabase } from "./supabase";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import {AntDesign} from '@expo/vector-icons';
import styles from './Styles'; 
import { StatusBar } from "react-native";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const image = require('./assets/moon_2.jpg');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("Todos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setTodos(data);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const { data, error } = await supabase
      .from("Todos")
      .insert([{ title }])
      .select("*");

    if (error) {
      console.error("Error inserting todo:", error);
      return;
    }

    setTodos([...todos, data[0]]);
    setTitle("");
    setShowAdd(false);
  };

  const markComplete = async (id, completed) => {
    const { error } = await supabase
      .from("Todos")
      .update({ completed: !completed })
      .match({ id });
    if (error) console.error(error);
    else fetchTodos();
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase.from("Todos").delete().match({ id });
    if (error) console.error(error);
    else fetchTodos();
  };

  const onGestureEvent = (index) => {
    return Animated.event(
      [{ nativeEvent: { translationX: todos[index].translateX } }],
      { useNativeDriver: true }
    );
  };

  const onHandlerStateChange = (event, id, index) => {
    const translateX = todos[index].translateX;

    if (event.nativeEvent.state === 5) {
      if (event.nativeEvent.translationX < -150) {
        deleteTodo(id);
      }

      // Reset gesture position
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const showAddTodo = () => {
    setShowAdd((prev) => !prev);
  };

  const renderTodo = ({ item, index }) => {
    if (!item.translateX) {
      item.translateX = new Animated.Value(0);
    }

    return (
      <PanGestureHandler
        onGestureEvent={onGestureEvent(index)}
        onHandlerStateChange={(event) => onHandlerStateChange(event, item.id, index)}
        activeOffsetX={[-25,25]}
      >
        <Animated.View style={[styles.todoItem, { transform: [{ translateX: item.translateX }] }]}>
          <TouchableOpacity onPress={() => markComplete(item.id, item.completed)}>
            <Text style={[styles.todoText, item.completed && styles.completedTodo]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ff6347" }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ImageBackground source={image} style={styles.background} resizeMode="cover">
          <View style={styles.container}>
            <Text style={styles.heading}>Today's Todududu</Text>

            <View style={styles.listContainer}>
              <FlatList
                data={todos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTodo}
                style={styles.listContent}
              />
            </View>

            {showAdd && (
              <View style={styles.addTodoContainer}>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Add a task..."
                  style={styles.input}
                  placeholderTextColor= '#000'
                />
                <TouchableOpacity onPress={addTodo} style={styles.addButton}>
                  <AntDesign name='arrowright' size={20} color='black'/>
                </TouchableOpacity>

                <TouchableOpacity onPress={showAddTodo} style={styles.addTodoButtonWhenShow}>
                  <AntDesign name="minus" size={20} color='#000' />
                </TouchableOpacity>
              </View>
            )}

            {!showAdd && (
              <TouchableOpacity onPress={showAddTodo} style={styles.addTodoButton}>
                <AntDesign name="plus" size={20} color='#000' />
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default App;
