import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { projects } from 'src/app/database/projects';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  protected projects = projects;

  constructor(private router: Router) {}

  openAbout() {
    this.router.navigate(['about/']);
  }

  openProject(value: number) {
    this.router.navigate(['project/' + value]);
  }
}
