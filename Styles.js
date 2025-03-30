import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    position: "absolute",
  },

  container: {
    flex: 1,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  listContainer: {
    flex: 1,
    width: '90%',
  },

  listContent: {
    marginBottom: 85,
  },

  heading: {
    fontSize: 24,
    fontFamily: "monospace",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 80,
    color: "#fcfcfc",
  },

  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "rgba(255, 255, 255, 1)",
    borderWidth: 1,
    opacity: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },

  todoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "rgba(255, 255, 255, 1)",
    fontFamily: "monospace",
  },

  completedTodo: {
    textDecorationLine: "line-through",
    color: "rgba(255, 255, 255, 0.5)",
  },

  addTodoContainer: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 5,
  },

  input: {
    paddingHorizontal: 10,
    fontFamily: 'monospace',
    bottom: 30,
    width: 290,
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 1)",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    marginRight: 14,
  },

  addButton: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    bottom: 30,
    height: 40,
    width: 40,
    padding: 10,
    borderRadius: 100,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  addTodoButton: {
    position: "absolute",
    bottom: 35,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 1)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  addTodoButtonWhenShow: {
    position: "absolute",
    bottom: 80,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 1)",
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

export default styles;