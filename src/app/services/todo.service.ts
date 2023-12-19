import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        throw error; // Rethrow the error to propagate it to the subscriber
      })
    );
  }

  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        throw error; // Rethrow the error to propagate it to the subscriber
      })
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    const body = JSON.stringify(todo);
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<Todo>(this.apiUrl, body, { headers }).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        throw error; // Rethrow the error to propagate it to the subscriber
      })
    );
  }

  updateTodo(id: number, todo: Todo): Observable<Todo> {
    const body = JSON.stringify(todo);
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, body, { headers }).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        throw error; // Rethrow the error to propagate it to the subscriber
      })
    );
  }

  updateTodoStatus(todoId: number, isDone: boolean): Observable<void> {
    const url = `${this.apiUrl}/${todoId}/status`;
    return this.http.patch<void>(url, isDone).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        throw error; // Rethrow the error to propagate it to the subscriber
      })
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        throw error; // Rethrow the error to propagate it to the subscriber
      })
    );
  }
}
