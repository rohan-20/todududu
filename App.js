import React, { useState, useEffect } from "react";
import { View,ScrollView, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Animated, ImageBackground} from "react-native";
import { supabase } from "./supabase";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import {AntDesign} from '@expo/vector-icons';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const image = require('./assets/background_1.jpg');

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
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.card}>
        {/* <ImageBackground source={image} style={styles.container}> */}
        <Text style={styles.heading}>Today's Todududu</Text>

        <View style={styles.listContainer}>
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTodo}
            contentContainerStyle={styles.listContent}
          />
        </View>

        {showAdd && (
          <View style={styles.addTodoContainer}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Add a task..."
              style={styles.input}
              placeholderTextColor='#9696d6'

            />
            <TouchableOpacity onPress={addTodo} style={styles.addButton}>
              <AntDesign name='arrowright' size={20} color='black'/>
            </TouchableOpacity>

            <TouchableOpacity onPress={showAddTodo} style={styles.addTodoButtonWhenShow}>
              <AntDesign name="minus" size={18} color='#000' />
            </TouchableOpacity>
          </View>
        )}

        {!showAdd && (
          <TouchableOpacity onPress={showAddTodo} style={styles.addTodoButton}>
            <AntDesign name="plus" size={18} color='#000' />
          </TouchableOpacity>
        )}
      {/* </ImageBackground> */}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
  completedTodo: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  addTodoContainer: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 5,
  },
  input: {
    padding: 10,
    width: 290,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginRight: 14,
  },
  addButton: {
    backgroundColor: "#a4d2db",
    height: 40,
    width: 40,
    padding: 10,
    borderRadius: 10,
    opacity: 0.7,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addTodoButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "#edb4cc	",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addTodoButtonWhenShow: {
    position: "absolute",
    bottom: 55,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "#edb4cc",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addTodoText: {
    fontSize: 25,
    color: "#000000",
    textAlign: "center",
  },
});

export default App;
