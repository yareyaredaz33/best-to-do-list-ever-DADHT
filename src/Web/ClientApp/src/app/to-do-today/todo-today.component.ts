import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TodoListsClient, TodoItemsClient,
  TodoListDto, TodoItemDto, LookupDto,
  CreateTodoListCommand, UpdateTodoListCommand,
  CreateTodoItemCommand, UpdateTodoItemCommand, UpdateTodoItemDetailCommand
} from '../web-api-client';

@Component({
  selector: 'app-todo-component',
  templateUrl: './todo-today.component.html',
  styleUrls: ['./todo-today.component.scss']
})
export class TodoTodayComponent implements OnInit {
  debug = false;
  lists: TodoListDto[];
  priorityLevels: LookupDto[];
  selectedList: TodoListDto;
  selectedItem: TodoItemDto;
  newListEditor: any = {};
  listOptionsEditor: any = {};
  itemDetailsEditor: any = {};
  newListModalRef: BsModalRef;
  listOptionsModalRef: BsModalRef;
  deleteListModalRef: BsModalRef;
  itemDetailsModalRef: BsModalRef;
  tasks: Array<TodoItemDto> =[]
  tasksForToday: Array<TodoItemDto> =[]

  constructor(
    private listsClient: TodoListsClient,
    private itemsClient: TodoItemsClient,
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
        this.tasksForToday = this.tasks.filter(e=> this.isToday(new Date(e.deadline)))

      },
      error => console.error(error)
    );
  }

  // Lists
  remainingItems(list: TodoListDto): number {
    return list.items.filter(t => !t.done).length;
  }

   isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  }
  updateItem(item: TodoItemDto, pressedEnter: boolean = false): void {
    const isNewItem = item.id === 0;


    if (item.id === 0) {
      this.itemsClient
        .createTodoItem({ title: item.title, listId: this.selectedList.id } as CreateTodoItemCommand)
        .subscribe(
          result => {
            item.id = result;
          },
          error => console.error(error)
        );
    } else {
      this.itemsClient.updateTodoItem(item.id, item as UpdateTodoItemCommand).subscribe(
        () => console.log('Update succeeded.'),
        error => console.error(error)
      );
    }

    this.selectedItem = null;

  }

}
