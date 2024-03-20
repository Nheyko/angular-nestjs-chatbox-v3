import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from './chat.service';
import { HttpClient } from '@angular/common/http';
import { Emitters } from '../emitters/emitters';
import { Observable, Subject, Subscription, map } from 'rxjs';
import { Message } from './IMessage';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { User } from '../users/IUser';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild('chatbox') chatbox: ElementRef;

  chatForm: FormGroup;
  chatData: string[] = [];

  messages$: Observable<Message[]>;
  messages: Message[] = [];
  messagesSubscription: Subscription;

  newMessage$: Observable<Message>;
  newMessageSubscription: Subscription;

  subjectMessage$ = new Subject<SafeHtml[]>();
  sanitizedMessages: SafeHtml[] = [];

  onlineUsers$: Observable<string[]>;
  usersSubscription: Subscription;

  data = {
    user_id: 0,
    username: "",
    message_content: "",
    destinator: null
  };

  save_data = {
    user_id: 0,
    username: "",
  }

  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) { }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(e: Event) {

    this.data.username = "System";
    this.data.message_content = `User ${this.save_data.username} has left the chat.`;
    this.data.destinator = null;
    this.chatService.sendMessage(this.data);
  }

  ngOnInit() {

    this.chatForm = this.formBuilder.group({
      dest: ['', []],
      message: ['', [Validators.required]],
    });

    this.http.get('http://localhost:3000/auth/user', { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.data.user_id = res.id;
        this.save_data.user_id = res.id;
        this.save_data.username = res.username;

        this.data.username = "System";
        this.data.message_content = `User ${res.username} has joined the chat.`
        this.chatService.sendMessage(this.data);

        this.usersService.getUser(res.id).subscribe({
          next: (user: User) => {
            this.chatService.onConnectUser(user.username, true);
            this.onlineUsers$ = this.chatService.getConnectedList();
          }
        });

        this.messages$ = this.chatService.getLastMessages().pipe(
          map(messages => messages.reverse())
        );
        this.messagesSubscription = this.messages$.subscribe({
          next: (messages) => {
            this.sanitizedMessages = messages.map((message) => this.sanitize(message.content));
            this.messages = messages;
            this.messages = this.messages.slice(-50);
            this.subjectMessage$.next(this.sanitizedMessages);
          }
        });

        this.newMessage$ = this.chatService.getNewMessage();
        this.newMessageSubscription = this.newMessage$.subscribe({
          next: (newMessage: Message) => {
            this.messages.push(newMessage); // Add new message to the local array
            this.messages = this.messages.slice(-50); // Keep only the latest 50 messages
            this.subjectMessage$.next(this.messages); // Emit updated messages to subscribers
            this.cdRef.detectChanges();
            this.autoScrollWhenNewMessage();
          }
        });
        Emitters.authEmitter.emit(true);
      },
      error: () => {
        Emitters.authEmitter.emit(false);
      }
    });
  }

  ngAfterViewInit() {
    if (this.chatbox && this.chatbox.nativeElement) {
      setTimeout(() => {
        this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
      }, 100);
    }
  }

  ngOnDestroy() {

    this.data.username = "System";
    this.data.message_content = `User ${this.save_data.username} has left the chat.`;
    this.data.destinator = null;
    this.chatService.sendMessage(this.data);

    this.usersService.getUser(this.data.user_id).pipe().subscribe({
      next: (user: User) => {
        this.usersService.updatePatch(this.data.user_id, user).subscribe({
          next: () => {
            this.chatService.onConnectUser(user.username, false);
          }
        });
      }
    });

    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }

    if (this.newMessageSubscription) {
      this.newMessageSubscription.unsubscribe();
    }

    if(this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

  sanitize(content: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, content);
  }

  autoScrollWhenNewMessage() {
    const chatboxElement = this.chatbox.nativeElement as HTMLElement;
    const scrollHeight = chatboxElement.scrollHeight;
    const clientHeight = chatboxElement.clientHeight;
    if (scrollHeight > clientHeight) {
      chatboxElement.scrollTop = scrollHeight - clientHeight;
    }
  }

  onSubmit() {
    if (!this.chatForm.value) return;
    const message = this.chatForm.value.message;
    if (this.chatForm.value.dest) {
      this.usersSubscription = this.usersService.getUsers().subscribe({
        next: (users) => {
          const foundUser = users.find(user => user.username === this.chatForm.value.dest);
          if (foundUser) {
            if (foundUser.username === this.save_data.username) {
              this.data.username = "System"
              this.data.message_content = "You can't send private message to yourself.";
              this.data.destinator = this.data.user_id;
              this.chatService.sendMessage(this.data);
            }
            else {
              this.data.username = `To ${foundUser.username}`;
              this.data.message_content = message;
              this.data.destinator = this.save_data.user_id;
              this.chatService.sendMessage(this.data);

              let from = {
                user_id: this.save_data.user_id,
                username: `From ${this.save_data.username}`,
                message_content: message,
                destinator: foundUser.id
              }
              this.chatService.sendMessage(from);
            }
          }
          else {
            this.data.username = "System"
            this.data.message_content = "This user doesn't exist.";
            this.data.destinator = this.data.user_id;
            this.chatService.sendMessage(this.data);
          }
        }
      });
    } else {
      this.data.username = this.save_data.username;
      this.data.destinator = null;
      this.data.message_content = this.chatForm.value.message;
      this.chatService.sendMessage(this.data);
    }

    this.chatForm.patchValue({
      message: ''
    });
  }
}