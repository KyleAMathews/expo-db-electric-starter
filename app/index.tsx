import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLiveQuery, useOptimisticMutation } from '@tanstack/react-db';
import { todoCollection, mutationFn } from '../src/db/collections';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const [newTodoText, setNewTodoText] = useState('');

  // Query todos from the collection
  const { data: todos } = useLiveQuery(q => q.from({ todoCollection }));

  console.log({ todos })

  // Set up mutations
  const addTodo = useOptimisticMutation({ mutationFn });
  const updateTodo = useOptimisticMutation({ mutationFn });
  const deleteTodo = useOptimisticMutation({ mutationFn });

  // Handle adding a new todo
  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    addTodo.mutate(() =>
      todoCollection.insert({
        // For a real app, you'd want to use a proper ID generation strategy
        id: Math.floor(Math.random() * 1000000),
        text: newTodoText,
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      })
    );

    setNewTodoText('');
  };

  // Handle toggling a todo's completed status
  const handleToggleTodo = (todo) => {
    updateTodo.mutate(() =>
      todoCollection.update(todo.id, (draft) => {
        draft.completed = !draft.completed
      })
    );
  };

  // Handle deleting a todo
  const handleDeleteTodo = (todo) => {
    deleteTodo.mutate(() =>
      todoCollection.delete(todo.id)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>

      {/* Add new todo */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodoText}
          onChangeText={setNewTodoText}
          placeholder="Add a new todo..."
        />
        <Button title="Add" onPress={handleAddTodo} />
      </View>

      {/* Todo list */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              style={styles.todoCheckbox}
              onPress={() => handleToggleTodo(item)}
            >
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text
              style={[
                styles.todoText,
                item.completed && styles.completedTodoText
              ]}
            >
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteTodo(item)}>
              <Text style={styles.deleteButton}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginRight: 10,
    borderRadius: 4,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  todoCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#0080ff',
  },
  todoText: {
    flex: 1,
  },
  completedTodoText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteButton: {
    color: '#ff3b30',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
