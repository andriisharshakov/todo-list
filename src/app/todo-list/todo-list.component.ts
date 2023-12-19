import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../services/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: Todo = { todoId: 0, title: '', description: '', isDone: false };

  isEditMode = false; // Flag to track if we are in edit mode
  
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getAllTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  addTodo() {
    this.todoService.addTodo(this.newTodo).subscribe(() => {
      this.loadTodos();
      this.clearForm();
    });
  }

  editTodo(todo: Todo) {
    // Put the todo into edit mode
    this.newTodo = { ...todo };
    this.isEditMode = true;
  }

  saveTodo() {
    this.todoService.updateTodo(this.newTodo.todoId, this.newTodo).subscribe(() => {
      this.loadTodos();
      this.clearForm();
    });
  }

  updateTodoStatus(todo: Todo) {
    // Always update the status when the checkbox is checked/unchecked
    this.todoService.updateTodoStatus(todo.todoId, todo.isDone).subscribe(() => {
      this.loadTodos();
    });
  }

  deleteTodo(todoId: number) {
    this.todoService.deleteTodo(todoId).subscribe(() => {
      this.loadTodos();
    });
  }

  clearForm() {
    // Clear the form and exit edit mode
    this.newTodo = { todoId: 0, title: '', description: '', isDone: false };
    this.isEditMode = false;
  }
}