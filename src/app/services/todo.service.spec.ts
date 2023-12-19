import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { environment } from '../../../environments/environment';
import { Todo } from './todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todos', () => {
    const mockTodos: Todo[] = [{ todoId: 1, title: 'Test Todo', description: 'Description', isDone: false }];

    service.getAllTodos().subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should handle error during get all todos', () => {
    service.getAllTodos().subscribe(
      () => {
        fail('Should have failed with an error');
      },
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));
  });

  it('should get a todo by id', () => {
    const mockTodo: Todo = { todoId: 1, title: 'Test Todo', description: 'Description', isDone: false };

    service.getTodoById(1).subscribe((todo) => {
      expect(todo).toEqual(mockTodo);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodo);
  });

  it('should handle error during get todo by id', () => {
    const todoId = 1;

    service.getTodoById(todoId).subscribe({
      error: (error) => expect(error).toBeTruthy(),
      complete: () => fail('Should have failed with an error')
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/${todoId}`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));
  });

  it('should add a todo', () => {
    const validTodo: Todo = { todoId: 0, title: 'Test Todo', description: 'Description', isDone: false };

    service.addTodo(validTodo).subscribe((todo) => {
      expect(todo).toEqual(validTodo);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(validTodo);
  });

  it('should handle error during add todo', () => {
    const invalidTodo: Todo = { todoId: 0, title: '', description: 'Description', isDone: false };

    service.addTodo(invalidTodo).subscribe(
      () => {
        fail('Should have failed with an error');
      },
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}`);
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('Validation error'));
  });

  it('should update a todo', () => {
    const existingTodo: Todo = { todoId: 1, title: 'Existing Todo', description: 'Description', isDone: false };
    const validUpdatedTodo: Todo = { todoId: 1, title: 'Updated Todo', description: 'Updated Description', isDone: true };

    service.updateTodo(1, validUpdatedTodo).subscribe((todo) => {
      expect(todo).toEqual(validUpdatedTodo);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(validUpdatedTodo);
  });

  it('should handle error during update todo', () => {
    const nonExistingId = 999;
    const validUpdatedTodo: Todo = { todoId: 999, title: 'Updated Todo', description: 'Updated Description', isDone: true };

    service.updateTodo(nonExistingId, validUpdatedTodo).subscribe(
      () => {
        fail('Should have failed with an error');
      },
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/${nonExistingId}`);
    expect(req.request.method).toBe('PUT');
    req.error(new ErrorEvent('Not found error'));
  });

  it('should update a todo status', () => {
    const existingTodo: Todo = { todoId: 1, title: 'Existing Todo', description: 'Description', isDone: false };
    const validStatus = true;

    service.updateTodoStatus(1, validStatus).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/1/status`);
    expect(req.request.method).toBe('PATCH');
    req.flush(existingTodo);
  });

  it('should handle error during update todo status', () => {
    const nonExistingId = 999;
    const validStatus = true;

    service.updateTodoStatus(nonExistingId, validStatus).subscribe(
      () => {
        fail('Should have failed with an error');
      },
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/${nonExistingId}/status`);
    expect(req.request.method).toBe('PATCH');
    req.error(new ErrorEvent('Not found error'));
  });

  it('should delete a todo', () => {
    const existingTodo: Todo = { todoId: 1, title: 'Existing Todo', description: 'Description', isDone: false };

    service.deleteTodo(1).subscribe(() => {
      // No assertion needed for a successful delete
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(existingTodo);
  });

  it('should handle error during delete todo', () => {
    const nonExistingId = 999;

    service.deleteTodo(nonExistingId).subscribe(
      () => {
        fail('Should have failed with an error');
      },
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/${nonExistingId}`);
    expect(req.request.method).toBe('DELETE');
    req.error(new ErrorEvent('Not found error'));
  });
});