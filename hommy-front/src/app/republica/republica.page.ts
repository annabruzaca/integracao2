import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-republica',
  templateUrl: './republica.page.html',
  styleUrls: ['./republica.page.scss'],
})
export class RepublicaPage implements OnInit {

  commentForm: FormGroup;
  editCommentForm: FormGroup;
  editMode = false;
  username = localStorage.getItem('username');

  republic_id: number;
  comments = [];
  textComment: string = '';
  comment_id: number;

  constructor(
      public formbuilder: FormBuilder,
      public commentService: CommentService ) {
    this.republic_id = JSON.parse(localStorage.getItem('republica')).id;
    this.commentForm = this.formbuilder.group({
      text: [null, [Validators.required, Validators.maxLength(140)]],
    });
    this.editCommentForm = this.formbuilder.group({
      text: [null, [Validators.required, Validators.maxLength(140)]],
    });
  }

  ngOnInit() {
    this.showRepublicWithComments(this.republic_id);
  }

  sendComment(form){
    console.log(form);
    console.log(form.value);
    form.value.republic_id = this.republic_id;
    form.value.username = this.username;
    this.editMode = false;
    this.commentService.createComment(form.value).subscribe(
        (res) => {
            console.log(res);
            this.commentForm.reset();
            this.showRepublicWithComments(this.republic_id);
        }, (err) => {console.log(err); }
    )
  }

  showRepublicWithComments(republic_id){
      this.commentService.showRepublicWithComments(republic_id).subscribe(
          (res) => {
          this.comments = res.comments;
          console.log(res);
          console.log(this.comments);
      }, (err) => {console.log('nao funcionou'); })
  }

  sendEditComment(form){
    console.log(form);
    console.log(form.value);
    form.value.id = this.id;
    this.editMode = false;
    this.commentService.updateComment(this.comment_id, form.value).subscribe(
        (res)=>{
            console.log(res);
            this.textComment = '';
            this.editCommentForm.reset();
            this.showRepublicWithComments(this.republic_id);
        }, (err) => {console.log(err);
        }
    )
  }

  toggleEdit(id){
      this.comment_id = id;
      for( let comment of this.comments ){
        if (comment.id == id){
          this.textComment = comment.text;
        }
      }
      this.editMode = true;
    }

  deleteComment(id){
    this.commentService.deleteComment(id).subscribe(
      (res)=>{
        console.log(res);
        alert(res[0]);
        this.showRepublicWithComments(this.republic_id);
      },(err) =>{
        console.log(err);
        alert(err.error[0]);
      }
    );
  }

}
