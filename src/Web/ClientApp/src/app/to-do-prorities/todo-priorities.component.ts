import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TodoListsClient, TodoItemsClient,
  TodoListDto, TodoItemDto, LookupDto,
  CreateTodoListCommand, UpdateTodoListCommand,
  CreateTodoItemCommand, UpdateTodoItemCommand, UpdateTodoItemDetailCommand
} from '../web-api-client';
import {popperGenerator} from "@popperjs/core";

@Component({
  selector: 'app-todo-component',
  templateUrl: './todo-priorities.component.html',
  styleUrls: ['./todo-priorities.component.scss']
})
export class TodoPrioritiesComponent implements OnInit {
  debug = false;
  lists: TodoListDto[];
  priorityLevels: LookupDto[];
  tasks: Array<TodoItemDto> =[]
  tasksZero: Array<TodoItemDto> =[]
  tasksOne: Array<TodoItemDto> =[]
  tasksTwo: Array<TodoItemDto> =[]
  tasksThree: Array<TodoItemDto> =[]

  constructor(
    private listsClient: TodoListsClient,
  ) {}

  ngOnInit(): void {
    this.listsClient.getTodoLists().subscribe(
      result => {
        this.lists = result.lists;
        this.priorityLevels = result.priorityLevels;
        console.log(this.lists)
        for (let i = 0; i < this.lists.length; i++) {
          for (let j = 0; j < this.lists[i].items.length; j++) {
             this.tasks.push(this.lists[i].items[j])
          }
        }
        this.tasksZero = this.tasks.filter(e=>e.priority==0)
        this.tasksOne = this.tasks.filter(e=>e.priority==1)
        this.tasksTwo = this.tasks.filter(e=>e.priority==2)
        this.tasksThree = this.tasks.filter(e=>e.priority==3)
      },
      error => console.error(error)
    );
  }

  // Lists
  remainingItems(list: TodoListDto): number {
    return list.items.filter(t => !t.done).length;
  }
}
